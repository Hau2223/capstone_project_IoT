import {
  Text,
  View,
  FlatList,
  Animated,
  Image,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  PermissionsAndroid,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {Switch, Menu} from 'react-native-paper';
import colors from '../../../assets/common/colorCss';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMa from 'react-native-vector-icons/MaterialIcons';
import IconFo from 'react-native-vector-icons/FontAwesome';
import {
  leaveMembertDevive,
  memberId,
  updateMember,
} from '../../../services/menberServices';
import {gardenId} from '../../../services/authServices';
import HeaderCompo from '../../components/HeaderCompo';
import {
  updateNameDevice,
  uploadImgDevice,
} from '../../../services/deviceServices';
import {createStyle} from './style';
import {updateControl} from '../../../services/controlServices';

const DetailScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const {item: initialItem, deviceId} = route.params;
  const isFocused = useIsFocused();
  const [item, setItem] = useState(initialItem);
  const [nameDevice, setNameDevice] = useState(item.data.name_area || '');
  const [modalDevice, setModalDevice] = useState(false);
  const [modalMember, setModalMember] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollY = useRef(new Animated.Value(1)).current;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false); // State để kiểm soát hiển thị Menu

  const sensors = item?.data?.sensors || [];
  const controls = item?.data?.controls || [];

  const sensorMap = Object.fromEntries(sensors.map(s => [s.type, s]));
  const controlMap = Object.fromEntries(controls.map(c => [c.name, c]));

  const {
    temperature: temperatureSensor,
    humidity: humiditySensor,
    luminosity: luminositySensor,
    moisture: moistureSensor,
    stream: streamSensor,
  } = sensorMap;

  const {
    water: waterControl,
    light: lightControl,
    wind: windControl,
  } = controlMap;

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      const sdkInt = Platform.Version;
      let permission;

      if (sdkInt >= 33) {
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else {
        permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      }

      const alreadyGranted = await PermissionsAndroid.check(permission);
      if (alreadyGranted) return true;

      const result = await PermissionsAndroid.request(permission, {
        title: t('selectImagePermissionTitle'),
        message: t('selectImagePermissionMessage'),
        buttonNeutral: t('ask_later'),
        buttonNegative: t('deny'),
        buttonPositive: t('agree'),
      });

      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert(t('permissionDenied'), t('grant_photo_access'), [
        {text: t('cancel')},
        {text: t('open_settings'), onPress: () => Linking.openSettings()},
      ]);
      return;
    }

    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];

        if (selectedImage.uri) {
          const form = new FormData();
          form.append('img_area', {
            uri: selectedImage.uri,
            name: selectedImage.fileName || 'avatar.jpg',
            type: selectedImage.type || 'image/jpeg',
          });

          try {
            const uploadRes = await uploadImgDevice({id_esp: deviceId}, form, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (uploadRes.message === 'Device image updated') {
              handleChangeImage('img_area', selectedImage.uri);
              Alert.alert(t('alert_success'), t('image_updated_successfully'), [
                {text: t('ok')},
              ]);
            }
          } catch (err) {
            console.error('Lỗi khi lưu thông tin:', err);
            Alert.alert(t('alert_error'), t('image_upload_failed'));
          }
        }
      }
    });
  };

  const handleChangeImage = (field, value) => {
    setItem(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }));
  };

  const fetchDetailGarden = useCallback(async () => {
    try {
      const data = await gardenId();
      const ids = data?.data || [];
      if (!ids.includes(deviceId)) {
        Alert.alert(
          t('alert_info'),
          `${t('invalid_device_id1')} ${deviceId} ${t('invalid_device_id2')}')`,
          [{text: t('ok'), onPress: () => navigation.goBack()}],
        );
        setLoading(false);
        return;
      }
      const res = await memberId({id: deviceId});
      if (res?.members) {
        setUserInfo(res.members);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useFocusEffect(
    useCallback(() => {
      fetchDetailGarden();
      const interval = setInterval(() => {
        fetchDetailGarden();
      }, 5000);

      return () => clearInterval(interval);
    }, [fetchDetailGarden]),
  );

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [265, 150],
    extrapolate: 'clamp',
  });

  const headerFontSize = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [24, 20],
    extrapolate: 'clamp',
  });

  const headerBottom = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 50],
    extrapolate: 'clamp',
  });

  const numberBottom = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [2, 1],
    extrapolate: 'clamp',
  });

  const refreshData = updates => {
    setItem(prev => ({
      ...prev,
      data: {...prev.data, ...updates},
    }));
  };

  const handleChangeNameDevices = useCallback(async name_area => {
    try {
      const res = await updateNameDevice({
        id_esp: deviceId,
        name_area: name_area,
      });
      if (res.message === 'Garden name updated successfully') {
        Alert.alert(t('alert_info'), t('garden_name_updated_successfully'));
        refreshData({name_area});
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  }, []);

  const handlePromoteMember = () => {
    if (userInfo && userInfo.length > 1) {
      const currentUser = userInfo.find(
        user => user.isMe && user.role === 'owner',
      );
      if (currentUser) {
        const otherUsersList = userInfo.filter(u => !u.isMe);
        setOtherUsers(otherUsersList);
        if (otherUsersList.length > 0) {
          setShowDropdown(true);
        }
      }
    }
  };

  const updateControlMap = (controlType, newValue) => {
    setItem(prev => ({
      ...prev,
      data: {
        ...prev.data,
        controls: prev.data.controls.map(control =>
          control.name === controlType
            ? {...control, status: newValue}
            : control,
        ),
      },
    }));
  };

  // Hàm xử lý khi chọn một thành viên từ Menu
  const handleSelectUser = user => {
    setSelectedUser(user);
    setMenuVisible(false); // Đóng Menu sau khi chọn
  };

  const handleTransferOwnership = async selectedUser => {
    try {
      const res = await updateMember({
        id_esp: deviceId,
        userId: selectedUser.userId,
      });
      if (res.message === 'User promoted to owner successfully') {
        console.log('Chuyển quyền cho thành viên thành công');
        Alert.alert(t('success'), t('ownership_transferred'));
        await fetchDetailGarden();
      }
      // Ví dụ: Gọi API để rời thiết bị
      // await leaveDeviceApi({ deviceId, userId: currentUser.userId });
    } catch (error) {
      console.error('Lỗi khi rời thiết bị:', error);
    }
  };

  const handleLeaveDevice = async () => {
    try {
      const res = await leaveMembertDevive({
        id_esp: deviceId,
      });
      if (res.message === 'Successfully left the device') {
        navigation.goBack();
        console.log('Người dùng rời thiết bị', deviceId);
      }

      Alert.alert(t('alert_success'), t('device_left_successfully'));
    } catch (error) {
      console.error('Lỗi khi rời thiết bị:', error);
      Alert.alert(t('alert_error'), t('leave_device_failed'));
    }
  };

  return (
    <View style={styles.frame}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
      )}
      <HeaderCompo
        name={t('garden_info')}
        color={theme === 'light' ? colors.black : colors.white}
        bgcolor={theme === 'light' ? colors.white : colors.bg_dark}
        isPress={() => navigation.goBack()}
      />

      <Animated.View style={[styles.container1]}>
        <Animated.View style={[styles.img, {height: imageHeight}]}>
          <Image
            style={styles.imgStyle}
            source={{uri: item.data.img_area}}
            resizeMode="cover"
          />
          <Pressable style={styles.cameraIcon} onPress={pickImage}>
            <IconFo name="camera" style={styles.icCamera} />
          </Pressable>
        </Animated.View>
        <Animated.View
          style={[
            styles.titleContainer,
            {
              bottom: headerBottom,
            },
          ]}>
          <Animated.Text
            style={[
              styles.header2,
              {
                fontSize: headerFontSize,
              },
            ]}
            numberOfLines={numberBottom}>
            {item?.data?.name_area}
          </Animated.Text>
          <Animated.View style={[styles.headerButton]}>
            <TouchableOpacity
              style={styles.btnChange}
              onPress={() => setModalDevice(true)}>
              <Icon
                name="pencil"
                size={24}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnChange}
              onPress={() => {
                setModalMember(true);
                handlePromoteMember();
              }}>
              <IconMa
                name="person-remove"
                size={24}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollView}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={8}
        bounces={false}>
        <FrameItem1
          txtTemp={temperatureSensor?.value ?? 0}
          txtMoisture={moistureSensor?.value ?? 0}
          txtHumidity={humiditySensor?.value ?? 0}
          txtStream={streamSensor?.value ?? 0}
          txtLuminosity={luminositySensor?.value ?? 0}
        />
        <FrameItem2
          deviceId={deviceId}
          controlMap={controlMap}
          waterStatus={waterControl?.status}
          lightStatus={lightControl?.status}
          windStatus={windControl?.status}
          updateControlMap={updateControlMap}
        />
        <FrameItem3 users={userInfo || []} />
        <View style={{height: 20}} />
      </Animated.ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalDevice}
        onRequestClose={() => setModalDevice(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('enter_new_name_prompt')}</Text>
            <TextInput
              placeholder={t('enter_new_name_placeholder')}
              placeholderTextColor="#999"
              keyboardType="default"
              value={nameDevice}
              onChangeText={text => {
                setError(null);
                setNameDevice(text);
              }}
              style={styles.modalInput}
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalDevice(false)}>
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={() => {
                  handleChangeNameDevices(nameDevice);
                  setModalDevice(false);
                }}>
                <Text style={styles.modalButtonText}>{t('rename')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalMember}
        onRequestClose={() => setModalMember(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {showDropdown
                ? t('select_member_to_transfer')
                : t('leave_device_confirm')}
            </Text>

            {showDropdown && (
              <View style={styles.menuContainer}>
                {selectedUser && (
                  <Text style={styles.selectedUserText}>
                    {t('selected_member')} {selectedUser.name}
                  </Text>
                )}
                {/* Nút để hiển thị/ẩn FlatList */}
                <TouchableOpacity
                  style={styles.menuAnchor}
                  onPress={() => setMenuVisible(!menuVisible)}>
                  <Text style={styles.menuAnchorText}>
                    {selectedUser ? selectedUser.name : t('select_member')}
                  </Text>
                  <Icon
                    name={menuVisible ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.primary}
                    style={styles.menuIcon}
                  />
                </TouchableOpacity>

                {/* Hiển thị FlatList chỉ khi menuVisible là true */}
                {menuVisible && (
                  <FlatList
                    data={otherUsers}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                      (item.userId || index).toString()
                    }
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                          handleSelectUser(item); // Chọn thành viên
                          setMenuVisible(false); // Ẩn FlatList sau khi chọn
                        }}>
                        <Text style={styles.menuItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <Text style={styles.noMembersText}>
                        {t('no_members')}
                      </Text>
                    }
                    style={styles.flatList} // Thêm style cho FlatList
                  />
                )}
              </View>
            )}

            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setModalMember(false);
                  setShowDropdown(false);
                  setSelectedUser(null);
                  setMenuVisible(false);
                }}>
                <Text style={styles.modalButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={() => {
                  if (showDropdown) {
                    if (!selectedUser) {
                      Alert.alert(t('alert_info'), t('select_member_required'));
                      return;
                    }
                    handleTransferOwnership(selectedUser); // Gọi hàm chuyển quyền
                  } else {
                    handleLeaveDevice(); // Gọi hàm rời thiết bị
                  }
                  setModalMember(false);
                  setShowDropdown(false);
                  setSelectedUser(null);
                  setMenuVisible(false);
                }}>
                <Text style={styles.modalButtonText}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Header3 = ({header3}) => {
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return (
    <View>
      <Text style={styles.textHeader3}>{header3}</Text>
    </View>
  );
};

const FrameItem1 = ({
  txtMoisture,
  txtTemp,
  txtHumidity,
  txtStream,
  txtLuminosity,
}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const displayMois =
    txtMoisture === 2147483647 || txtMoisture == 0 ? '0.0%' : `${txtMoisture}%`;
  const displayTemp =
    txtTemp === 2147483647 || txtTemp == 0 ? '0.0°C' : `${txtTemp}°C`;
  const displayHum =
    txtHumidity === 2147483647 || txtHumidity == 0
      ? '0.0°C'
      : `${txtHumidity}°C`;

  return (
    <View style={styles.containerFrame}>
      <Header3 header3={t('sensors')} />
      <SensorComponent
        nameIcon={'water-percent'}
        colorIcon={'#2196F3'}
        txtSensor={t('soil_moisture')}
        txtNumb={displayMois}
      />
      <SensorComponent
        nameIcon={'temperature-celsius'}
        colorIcon={'#FF8A65'}
        txtSensor={t('temperature')}
        txtNumb={displayTemp}
      />
      <SensorComponent
        nameIcon={'weather-partly-cloudy'}
        colorIcon={'#4FC3F7'}
        txtSensor={t('air_humidity')}
        txtNumb={displayHum}
      />
      <SensorComponent
        nameIcon={'water-pump'}
        colorIcon={'#00BCD4'}
        txtSensor={t('water_flow')}
        txtNumb={`${txtStream}%`}
      />
      <SensorComponent
        nameIcon={'white-balance-sunny'}
        colorIcon={'#FFD54F'}
        txtSensor={t('light_intensity')}
        txtNumb={`${txtLuminosity}%`}
      />
    </View>
  );
};

const SensorComponent = ({nameIcon, colorIcon, txtSensor, txtNumb}) => {
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return (
    <View style={styles.contentFrame}>
      <View style={styles.iconContent}>
        <Icon name={nameIcon} size={35} color={colorIcon} />
      </View>
      <View style={styles.textContent}>
        <Text style={styles.textStyle}>{txtSensor}</Text>
      </View>
      <View style={styles.valueContent}>
        <Text style={styles.textStyle}>{txtNumb}</Text>
      </View>
    </View>
  );
};

const FrameItem2 = ({
  deviceId,
  controlMap,
  waterStatus,
  lightStatus,
  windStatus,
}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const [controls, setControls] = useState({
    water: waterStatus,
    light: lightStatus,
    wind: windStatus,
  });

  useEffect(() => {
    setControls({
      water: waterStatus,
      light: lightStatus,
      wind: windStatus,
    });
  }, [waterStatus, lightStatus, windStatus]);

  const handleSwitchChange = async (controlType, controlId, currentValue) => {
    const newValue = !currentValue;

    setControls(prev => ({
      ...prev,
      [controlType]: newValue,
    }));

    try {
      await updateControl({
        id_esp: deviceId,
        controlId: controlId,
        status: newValue,
        mode: 'manual',
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      setControls(prev => ({
        ...prev,
        [controlType]: currentValue,
      }));
      Alert.alert(t('alert_error'), t('control_update_failed'));
    }
  };

  return (
    <View style={styles.containerFrame}>
      <Header3 header3={t('controls')} />
      <StatusComponent
        nameIcon="water"
        colorIcon="#03A9F4"
        txtStatus={t('water')}
        valueStatus={controls.water}
        onChange={() => {
          handleSwitchChange('water', controlMap?.water?._id, controls.water);
        }}
      />
      <StatusComponent
        nameIcon="lightbulb-on-outline"
        colorIcon="#FFEB3B"
        txtStatus={t('light')}
        valueStatus={controls.light}
        onChange={() => {
          handleSwitchChange('light', controlMap?.light?._id, controls.light);
        }}
      />
      <StatusComponent
        nameIcon="weather-windy"
        colorIcon="#90A4AE"
        txtStatus={t('wind')}
        valueStatus={controls.wind}
        onChange={() => {
          handleSwitchChange('wind', controlMap?.wind?._id, controls.wind);
        }}
      />
    </View>
  );
};

const StatusComponent = ({
  nameIcon,
  colorIcon,
  txtStatus,
  valueStatus,
  onChange,
}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return (
    <View style={styles.contentFrame}>
      <View style={styles.iconContent}>
        <Icon name={nameIcon} size={40} color={colorIcon} />
      </View>
      <View style={styles.textContent}>
        <Text style={styles.textStyle}>{txtStatus}</Text>
      </View>
      <View style={styles.valueContent}>
        <Switch
          value={valueStatus}
          onValueChange={onChange}
          trackColor={{false: '#F6F6F6', true: 'white'}}
          thumbColor={valueStatus ? colors.primary : '#ACACAC'}
          style={{transform: [{scale: 1.2}]}}
        />
      </View>
    </View>
  );
};

const FrameItem3 = ({users = []}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  return (
    <View style={styles.containerFrame}>
      <Header3 header3={t('members')} />
      {users && users.length > 0 ? (
        <FlatList
          data={users.sort((a, b) => (a.isMe ? -1 : 1))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <UserComponent
              nameIcon={'account-circle'}
              img={item.img}
              colorIcon={'#D9D9D9'}
              txtUser={item.isMe ? t('you') : item.name}
              txtRole={
                item.role === 'owner' ? t('role_owner') : t('role_member')
              }
            />
          )}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noMembersText}>{t('no_members')}</Text>
      )}
    </View>
  );
};

const UserComponent = ({nameIcon, img, colorIcon, txtUser, txtRole}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);

  // Default fallback image if img is invalid or undefined
  const defaultImage =
    'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg';

  return (
    <View style={styles.UserFrame}>
      <View style={styles.iconContent}>
        <Image
          source={{uri: img && img !== 'Unknown' ? img : defaultImage}}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: theme === 'light' ? colors.primary : colors.bg_NaN,
          }}
          resizeMode="contain"
          onError={error =>
            console.log('Image load error:', error.nativeEvent.error)
          }
        />
      </View>
      <View style={styles.textUser}>
        <Text style={styles.textStyle}>{txtUser}</Text>
      </View>
      <View style={styles.textRole}>
        <Text style={styles.textStyle}>{txtRole}</Text>
      </View>
    </View>
  );
};

export default memo(DetailScreen);

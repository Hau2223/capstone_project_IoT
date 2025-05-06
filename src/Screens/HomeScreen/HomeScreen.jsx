import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  BackHandler,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useContext, useCallback, memo, useRef} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ItemHomePage from './components/ItemHomePage';
import CustomAlert from '../../components/CustomAlert';
import Icon from 'react-native-vector-icons/Ionicons';
import {gardenId} from '../../../services/authServices';
import {detailDevice} from '../../../services/deviceServices';
import colors from '../../../assets/common/colorCss';
import * as Animatable from 'react-native-animatable';
import {addMembertoDevice} from '../../../services/menberServices';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';
import LoadingModal from '../../components/LoadingModal';

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDevice, setModalDevice] = useState(false);
  const [notificationCount, setNotificationCount] = useState(20);

  const [deviceId, setDeviceId] = useState('');

  const handleGoToDetail = item => {
    const deviceId = item?.data?.id_esp;
    navigation.navigate('DetailScreen', {item, deviceId});
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewRef = useRef(null);
  const [garden, SetGarden] = useState(null);
  // console.log(garden);
  

  const fetchGarder = useCallback(async () => {
    // console.log('Fetching garden data Home');
    try {

      const res = await gardenId();
      if (res.status === 200) {
        // SetGarden(res.data);
        const dataGarden = await Promise.all(
          res.data.map(async id => {
            const deviceData = await detailDevice({id});
            return deviceData;
          }),
        );
        SetGarden(dataGarden);
      }
    } catch (err) {
      setError(err.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGarder();
      const interval = setInterval(() => {
        fetchGarder();
      }, 5000);

      return () => clearInterval(interval);
    }, [fetchGarder]),
  );

  useFocusEffect(
    useCallback(() => {
      viewRef.current?.fadeInRight();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        const currentRoute =
          navigation.getState().routes[navigation.getState().index].name;

        if (currentRoute === 'Home') {
          BackHandler.exitApp(); // Thoát app nếu đang ở màn hình Home
          return true;
        } else {
          navigation.goBack(); // Quay lại nếu không phải Home
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );
  const handleCreateDevice = useCallback(
    async id_esp => {
      if (!id_esp) {
        Alert.alert(t('alert_error'), t('enter_valid_device_code'));
        return;
      }
      try {
        setLoading(true);
        const res = await addMembertoDevice({id_esp});
        if (res.message === 'Member added successfully') {
          await fetchGarder();
          Alert.alert(t('alert_info'), t('garden_added_successfully'));
          // console.log('Thêm Khu vườn thành công:', res.data);
        }
      } catch (err) {
        if (err.response.data.message === 'Member already exists') {
          Alert.alert(t('alert_info'), t('device_already_added'));
        }
        setError(err.response.data.message || 'Error fetching user data');
      } finally {
        setLoading(false);
      }
    },
    [fetchGarder],
  );

  const renderSkeletonItem = () => (
    <View style={styles.itemSkeleton}>
      <SkeletonPlaceholder
        backgroundColor={theme === 'light' ? '#d3d3d3' : '#444'}
        highlightColor={theme === 'light' ? '#e8e8e8' : '#666'}
        speed={1500}>
        <View style={styles.contentSkeleton}>
          <View style={{width: '100%', height: 130, borderRadius: 10}} />
          <View style={{paddingHorizontal: 10, gap: 5}}>
            <View
              style={{
                width: '50%',
                height: 25,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                width: '100%',
                height: 15,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                width: '100%',
                height: 15,
                borderRadius: 5,
              }}
            />
            <View
              style={{
                width: '100%',
                height: 15,
                borderRadius: 5,
              }}
            />
            <View style={{width: '100%', height: 15, borderRadius: 5}} />
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );

  return (
    <View style={styles.frame}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
      )}
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>{t('your_garden')}</Text>
        </View>
        {/* <TouchableOpacity
          style={styles.header2}
          onPress={() => setModalVisible(true)}>
          <View style={styles.iconContainer}>
            <Icon name="notifications" size={30} color={colors.primary} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity> */}
        <CustomAlert
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
      <View style={styles.container}>
        {loading ? (
          <>
            <FlatList
              data={[...Array(6).keys()]}
              keyExtractor={item => item.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listSkeleton}
              columnWrapperStyle={styles.columnSkeleton}
              renderItem={renderSkeletonItem}
              ListFooterComponent={<View style={{height: 20}} />}
            />
          </>
        ) : (
          <>
            <FlatList
              data={garden}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              numColumns={2}
              keyExtractor={(item, index) =>
                item?.data?._id || index.toString()
              }
              ListFooterComponent={<View style={{height: 20}} />}
              renderItem={({item}) => {
                const sensors = item?.data?.sensors || [];
                const controls = item?.data?.controls || [];

                const sensorMap = Object.fromEntries(
                  sensors.map(s => [s.type, s]),
                );
                const controlMap = Object.fromEntries(
                  controls.map(c => [c.name, c]),
                );

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

                return (
                  <View style={styles.itemWrapper}>
                    <ItemHomePage
                      name_area={item?.data?.name_area}
                      temperature={`${temperatureSensor?.value ?? 0}`}
                      moisture={`${moistureSensor?.value ?? 0}`}
                      water={`${waterControl?.status === true ? t('status_on') : t('status_off')}`}
                      wind={`${windControl?.status === true ?  t('status_on') : t('status_off')}`}
                      img_area={item?.data?.img_area}
                      luminosity={`${luminositySensor?.value ?? 0}%`}
                      onPress={() => handleGoToDetail(item, item?.data?._id)}
                    />
                  </View>
                );
              }}
            />

            
          </>
        )}
      </View>

      <Animatable.View
        ref={viewRef}
        animation="fadeInRight"
        duration={800}
        delay={200}
        style={styles.floatingButtonWrapper}>
        <TouchableOpacity
          onPress={() => setModalDevice(true)}
          style={styles.floatingButton}>
          <Icon name="add-circle" size={60} color={colors.primary} />
        </TouchableOpacity>
      </Animatable.View>

      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalDevice}
        onRequestClose={() => setModalDevice(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('enter_device_code')}</Text>
            <TextInput
              placeholder={t('input_device_code')}
              placeholderTextColor="#999"
              keyboardType="default"
              value={deviceId}
              onChangeText={text => {
                setError(null);
                setDeviceId(text);
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
                  // console.log('Đã nhập:', deviceId);
                  handleCreateDevice(deviceId);
                  setModalDevice(false);
                }}>
                <Text style={styles.modalButtonText}>{t('connect')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingModal isLoading={loading}/>
    </View>
  );
};

export default memo(HomeScreen);

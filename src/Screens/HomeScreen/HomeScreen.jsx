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
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ItemHomePage from './components/ItemHomePage';
import CustomAlert from '../../components/CustomAlert';
import Icon from 'react-native-vector-icons/Ionicons';
import {gardenId, meAuth} from '../../../services/authServices';
import {detailDevice} from '../../../services/deviceServices';
import colors from '../../../assets/common/colorCss';
import * as Animatable from 'react-native-animatable';
import {
  addMembertoDevice,
  memBlockList,
} from '../../../services/menberServices';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';
import LoadingModal from '../../components/LoadingModal';
import Toast from 'react-native-toast-message';

const Tab = createMaterialTopTabNavigator();

const GardenList = ({gardens, loading, handleGoToDetail, theme, styles, t}) => {
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
    <View style={styles.container}>
      {loading ? (
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
      ) : gardens.length === 0 ? (
        <Text style={styles.emptyText}>{t('no_gardens')}</Text>
      ) : (
        <FlatList
          data={gardens}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          keyExtractor={(item, index) => item?.data?._id || index.toString()}
          ListFooterComponent={<View style={{height: 20}} />}
          renderItem={({item}) => {
            const sensors = item?.data?.sensors || [];
            const controls = item?.data?.controls || [];

            const sensorMap = Object.fromEntries(sensors.map(s => [s.type, s]));
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
                  water={`${
                    waterControl?.status === true
                      ? t('status_on')
                      : t('status_off')
                  }`}
                  wind={`${
                    windControl?.status === true
                      ? t('status_on')
                      : t('status_off')
                  }`}
                  img_area={item?.data?.img_area}
                  luminosity={`${luminositySensor?.value ?? 0}%`}
                  onPress={() => handleGoToDetail(item)}
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDevice, setModalDevice] = useState(false);
  const [notificationCount, setNotificationCount] = useState(20);
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewRef = useRef(null);
  const [gardens, setGardens] = useState([]);
  const [user, setUser] = useState(null);

  const handleGoToDetail = useCallback(
    item => {
      const deviceId = item?.data?.id_esp;
      navigation.navigate('DetailScreen', {item, deviceId});
    },
    [navigation],
  );

  const fetchGardens = useCallback(async () => {
    try {
      const res = await gardenId();
      if (res.status === 200) {
        const dataGarden = await Promise.all(
          res.data.map(async id => {
            const deviceData = await detailDevice({id});
            return deviceData;
          }),
        );
        setGardens(dataGarden);
        const me = await meAuth();
        if (me.status === 200) {
          setUser(me.data._id);
        } else {
          setError('Failed to fetch user data');
        }
      }
    } catch (err) {
      setError(err.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchGardens();
      const interval = setInterval(() => {
        fetchGardens();
      }, 5000);

      return () => clearInterval(interval);
    }, [fetchGardens]),
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
          BackHandler.exitApp();
          return true;
        } else {
          navigation.goBack();
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
        Toast.show({
          type: 'error',
          text1: t('alert_error'),
          text2: t('enter_valid_device_code'),
          text1Style: {fontSize: 20, color: colors.black},
          text2Style: {fontSize: 15, color: colors.black},
          position: 'top',
          autoHide: true,
          visibilityTime: 3000,
        });
        return;
      }
      try {
        setLoading(true);
        // const resblock = await memBlockList({id_esp});
        // if (resblock.message === 'Success') {
        //   const userExists = resblock.data.some(item => item.userId === user);
        //   if (userExists) {
        //     Toast.show({
        //       type: 'info',
        //       text1: t('alert_info'),
        //       text2: t('cannot_add_device'),
        //       position: 'top',
        //       autoHide: true,
        //       visibilityTime: 3000,
        //     });
        //     return;
        //   }
        // }
        const res = await addMembertoDevice({id_esp});
        if (res.message === 'Member added successfully') {
          await fetchGardens();
          Toast.show({
            type: 'success',
            text1: t('alert_info'),
            text2: t('garden_added_successfully'),
            text1Style: {fontSize: 20, color: colors.black},
            text2Style: {fontSize: 15, color: colors.black},
            position: 'top',
            autoHide: true,
            visibilityTime: 3000,
          });
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message;
        if (errMsg === 'User is blocked') {
          Toast.show({
            type: 'info',
            text1: t('alert_info'),
            text2: t('cannot_add_device'),
            text1Style: {fontSize: 20, color: colors.black},
            text2Style: {fontSize: 15, color: colors.black},
            position: 'top',
            autoHide: true,
            visibilityTime: 3000,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: t('alert_error'),
            text2: errMsg || t('failed_to_add_device'),
            text1Style: {fontSize: 20, color: colors.black},
            text2Style: {fontSize: 15, color: colors.black},
            position: 'top',
            autoHide: true,
            visibilityTime: 3000,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchGardens, t, user],
  );

  // Filter gardens based on user's role in members array
  const ownerGardens =
    gardens && Array.isArray(gardens)
      ? gardens.filter(garden =>
          garden?.data?.members?.some(
            member => member.userId === user && member.role === 'owner',
          ),
        )
      : [];

  const memberGardens =
    gardens && Array.isArray(gardens)
      ? gardens.filter(garden =>
          garden?.data?.members?.some(
            member => member.userId === user && member.role === 'member',
          ),
        )
      : [];

  const Gardensall =
    gardens && Array.isArray(gardens)
      ? gardens.filter(garden =>
          garden?.data?.members?.some(member => member.userId === user),
        )
      : [];

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
        <CustomAlert
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'none',
          },
          tabBarStyle: {
            backgroundColor: theme === 'light' ? colors.white : colors.bg_dark,
            elevation: 2,
            shadowOpacity: 0.1,
          },
          tabBarIndicatorStyle: {backgroundColor: colors.primary, height: 3},
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor:
            theme === 'light' ? colors.bg_InActopTab : colors.white,
        }}>
        <Tab.Screen name={t('all')}>
          {() => (
            <GardenList
              gardens={gardens}
              loading={loading}
              handleGoToDetail={handleGoToDetail}
              theme={theme}
              styles={styles}
              t={t}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name={t('role_owner')}>
          {() => (
            <GardenList
              gardens={ownerGardens}
              loading={loading}
              handleGoToDetail={handleGoToDetail}
              theme={theme}
              styles={styles}
              t={t}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name={t('role_member')}>
          {() => (
            <GardenList
              gardens={memberGardens}
              loading={loading}
              handleGoToDetail={handleGoToDetail}
              theme={theme}
              styles={styles}
              t={t}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

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
                  handleCreateDevice(deviceId);
                  setModalDevice(false);
                }}>
                <Text style={styles.modalButtonText}>{t('connect')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingModal isLoading={loading} />
    </View>
  );
};

export default memo(HomeScreen);

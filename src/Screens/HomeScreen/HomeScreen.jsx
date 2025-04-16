import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  BackHandler,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useCallback, memo} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import ItemHomePage from '../../components/ItemHomePage';
import CustomAlert from '../../components/CustomAlert';
import Icon from 'react-native-vector-icons/Ionicons';

import {detailSensor} from '../../../services/sensorServices';
import {FaThermometerHalf, FaTint, FaLightbulb, FaWind} from 'react-icons/fa';
import {MdWaterDrop} from 'react-icons/md';
import {gardenId, profile} from '../../../services/authServices';
import {detailDevice} from '../../../services/deviceServices';
import colors from '../../../assets/common/colorCss';

const HomeScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(20);
  const isFocused = useIsFocused();
  const handleGoToDetail = item => {
    const deviceId = item?.data?.id_esp;
    navigation.navigate('DetailScreen', {item,deviceId});
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [garden, SetGarden] = useState(null);

  const fetchGarder = useCallback(async () => {
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

  useEffect(() => {
    fetchGarder();
    const interval = setInterval(() => {
      fetchGarder();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
  return (
    <View style={styles.frame}>
      {isFocused && (
        <StatusBar backgroundColor={colors.secondary} barStyle="dark-content" />
      )}
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Vườn tiêu Bình Phước</Text>
        </View>
        <TouchableOpacity
          style={styles.header2}
          onPress={() => setModalVisible(true)}>
          <View style={styles.iconContainer}>
            <Icon name="notifications" size={30} color="#206477" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <CustomAlert
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={garden}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item, index) => item?.data?._id || index.toString()}
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
                  water={`${waterControl?.status === true ? 'ON' : 'OFF'}`}
                  wind={`${windControl?.status === true ? 'ON' : 'OFF'}`}
                  img_area={item?.data?.img_area}
                  luminosity={`${luminositySensor?.value ?? 0}%`}
                  onPress={() => handleGoToDetail(item,item?.data?._id)}
                />
              </View>
            );
          }}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  header: {
    height: 70,
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
  },
  header1: {
    height: 70,
    width: '80%',
    justifyContent: 'center',
  },
  textHeader: {
    color: '#206477',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  header2: {
    height: 70,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  container: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 80,
  },
  itemWrapper: {
    alignItems: 'center',
    width: '50%',
    padding: 5,
  },
  listContainer: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
});

export default memo(HomeScreen);

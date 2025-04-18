import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import ItemSortSchedule from '../../components/ItemSortSchedule';
import { getAllDevices } from '../../../services/deviceServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const itemSpacing = 20;
const itemWidth = (screenWidth - itemSpacing * 3) / 2;

const ScheduleScreen = ({ navigation, route }) => {
  const [scheduleCounts, setScheduleCounts] = useState({
    water: 0,
    light: 0,
    wind: 0,
  });
  const [error, setError] = useState(null);
  const [idUser, setIdUser] = useState(null);

  const loadIdUser = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setIdUser(parsedData.idUser || route.params?.idUser || '67fc85f73db6d19e181ad8a6');
      } else {
        setIdUser(route.params?.idUser || '67fc85f73db6d19e181ad8a6');
      }
    } catch (err) {
      console.error('Lỗi khi lấy idUser:', err);
      setIdUser(route.params?.idUser || '67fc85f73db6d19e181ad8a6');
    }
  }, [route.params?.idUser]);

  const fetchScheduleCounts = useCallback(async () => {
    if (!idUser) return; //

    try {
      setError(null);
      const response = await getAllDevices();
      const allDevices = response?.data || [];

      console.log('Tất cả thiết bị từ API:', allDevices);

      const counts = {
        water: 0,
        light: 0,
        wind: 0,
      };

      allDevices
        .filter(device => device.members?.some(member => member.userId === idUser))
        .forEach(device => {
          device.controls?.forEach(control => {
            if (control.schedules?.length > 0) {
              if (control.name === 'water' && !counts.waterMarked?.includes(device._id)) {
                counts.water += 1;
                counts.waterMarked = counts.waterMarked || [];
                counts.waterMarked.push(device._id);
              } else if (control.name === 'light' && !counts.lightMarked?.includes(device._id)) {
                counts.light += 1;
                counts.lightMarked = counts.lightMarked || [];
                counts.lightMarked.push(device._id);
              } else if (control.name === 'wind' && !counts.windMarked?.includes(device._id)) {
                counts.wind += 1;
                counts.windMarked = counts.windMarked || [];
                counts.windMarked.push(device._id);
              }
            }
          });
        });

      delete counts.waterMarked;
      delete counts.lightMarked;
      delete counts.windMarked;

      setScheduleCounts(counts);
      console.log('Số khu vực có lịch trình:', counts);
    } catch (err) {
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || 'Lỗi khi lấy dữ liệu thiết bị');
      setScheduleCounts({ water: 0, light: 0, wind: 0 });
    }
  }, [idUser]);

  useEffect(() => {
    loadIdUser();
  }, [loadIdUser]);

  useEffect(() => {
    if (idUser) {
      fetchScheduleCounts();
      const interval = setInterval(() => {
        fetchScheduleCounts();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [idUser, fetchScheduleCounts]);

  const handleGoToListDevices = controlName => {
    navigation.navigate('DevicesListScreen', {
      controlName,
      idUser,
    });
  };

  const getIconForControl = name => {
    try {
      switch (name) {
        case 'light':
          return require('../../../assets/icon/iconLightYellow.png');
        case 'water':
          return require('../../../assets/icon/iconWaring.png');
        case 'wind':
          return require('../../../assets/icon/iconFan.png');
        default:
          return require('../../../assets/icon/iconLightYellow.png');
      }
    } catch (e) {
      console.warn(`Icon not found for ${name}, using default icon`);
      return require('../../../assets/icon/iconWaring.png');
    }
  };

  const controlItems = [
    { name: 'water', label: 'Lịch tưới' },
    { name: 'light', label: 'Lịch đèn' },
    { name: 'wind', label: 'Lịch quạt' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Vườn tiêu Bình Phước</Text>
        </View>
      </View>
      <View style={styles.content}>
        {error ? (
          <Text>Lỗi: {error}</Text>
        ) : scheduleCounts.water + scheduleCounts.light + scheduleCounts.wind === 0 ? (
          <Text>Không có khu vực nào có lịch trình</Text>
        ) : (
          <View style={styles.itemRow}>
            {controlItems.map((item, index) => (
              <View
                key={item.name}
                style={[styles.itemWrapper, { width: itemWidth }]}
              >
                <ItemSortSchedule
                  img={getIconForControl(item.name)}
                  content={`${scheduleCounts[item.name]}`}
                  onPress={() => handleGoToListDevices(item.name)}
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default ScheduleScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  header: {
    height: 70,
    width: '100%',
    marginTop: 20,
  },
  header1: {
    height: 70,
    width: '100%',
    justifyContent: 'center',
  },
  textHeader: {
    color: '#000000',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  itemWrapper: {
    marginBottom: itemSpacing,
  },
});
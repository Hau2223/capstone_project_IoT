import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useCallback, useContext, memo} from 'react';
import {getAllDevices} from '../../../services/deviceServices';
import {profile} from '../../../services/authServices';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';
import {useTranslation} from 'react-i18next';

const screenWidth = Dimensions.get('window').width;
const itemSpacing = 15;
const itemWidth = screenWidth - itemSpacing * 2;

const ScheduleScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const [scheduleCounts, setScheduleCounts] = useState({
    water: 0,
    light: 0,
    wind: 0,
  });
  const [error, setError] = useState(null);
  const [idUser, setIdUser] = useState(null);

  useEffect(() => {
    const loadIdUser = async () => {
      try {
        const response = await profile();
        if (response?.data) {
          setIdUser(response.data._id);
          // console.log('ID User từ API:', response.data._id);
        }
      } catch (err) {
        console.error('Lỗi khi lấy idUser:', err);
      }
    };

    loadIdUser();
  }, []);

  const fetchScheduleCounts = useCallback(async () => {
    if (!idUser) return;

    try {
      setError(null);
      const response = await getAllDevices();
      const allDevices = response?.data || [];

      const counts = {
        water: 0,
        light: 0,
        wind: 0,
      };

      allDevices
        .filter(device =>
          device.members?.some(member => member.userId === idUser),
        )
        .forEach(device => {
          device.controls?.forEach(control => {
            if (control.schedules?.length > 0) {
              if (
                control.name === 'water' &&
                !counts.waterMarked?.includes(device._id)
              ) {
                counts.water += 1;
                counts.waterMarked = counts.waterMarked || [];
                counts.waterMarked.push(device._id);
              } else if (
                control.name === 'light' &&
                !counts.lightMarked?.includes(device._id)
              ) {
                counts.light += 1;
                counts.lightMarked = counts.lightMarked || [];
                counts.lightMarked.push(device._id);
              } else if (
                control.name === 'wind' &&
                !counts.windMarked?.includes(device._id)
              ) {
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
      // console.log('Số khu vực có lịch trình:', counts);
    } catch (err) {
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || 'Lỗi khi lấy dữ liệu thiết bị');
      setScheduleCounts({water: 0, light: 0, wind: 0});
    }
  }, [idUser]);

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

  const controlItems = [
    {name: 'water', label: t('watering_schedule'), icon: 'water', iconType: 'Ionicons'},
    {name: 'light', label: t('light_schedule'), icon: 'sunny', iconType: 'Ionicons'},
    {name: 'wind', label: t('fan_schedule'), icon: 'air', iconType: 'MaterialIcons'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {error ? (
          <Text style={styles.errorText}>{t('alert_error')}: {error}</Text>
        ) : scheduleCounts.water +
            scheduleCounts.light +
            scheduleCounts.wind ===
          0 ? (
          <Text style={styles.emptyText}>
            {t('no_schedule_available')}
          </Text>
        ) : (
          <View style={styles.itemColumn}>
            {controlItems.map((item, index) => (
              <TouchableOpacity
                key={item.name}
                style={styles.itemWrapper}
                onPress={() => handleGoToListDevices(item.name)}>
                <View
                  style={[styles.itemContent, {backgroundColor: '#217E54'}]}>
                  <View style={styles.textContainer}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemCount}>
                      {scheduleCounts[item.name]}
                    </Text>
                  </View>
                  <View style={styles.iconContainer}>
                    {item.iconType === 'Ionicons' ? (
                      <Icon name={item.icon} size={40} color="#fff" />
                    ) : (
                      <MaterialIcon name={item.icon} size={40} color="#fff" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default memo(ScheduleScreen);


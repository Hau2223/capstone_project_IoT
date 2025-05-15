import {
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect, useCallback, useContext, memo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { getAllDevices } from '../../../services/deviceServices';
import { profile } from '../../../services/authServices';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import colors from '../../../assets/common/colorCss';
import { ThemeContext } from '../../../assets/common/themeProvider';
import { createStyle } from './style';

const ReportScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const styles = createStyle(theme); 
  const isFocused = useIsFocused();
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [idUser, setIdUser] = useState(null);

  // Lấy idUser từ API profile
  const loadIdUser = useCallback(async () => {
    try {
      const response = await profile();
      if (response?.data) {
        setIdUser(response.data._id);
        // console.log('ID User từ API:', response.data._id);
      }
    } catch (err) {
      console.error('Lỗi khi lấy idUser:', err);
      setError('Không thể lấy thông tin người dùng');
    }
  }, []);

  // Lấy danh sách thiết bị
  const fetchDevices = useCallback(async () => {
    if (!idUser) return;

    try {
      setError(null);
      const response = await getAllDevices();
      const allDevices = response?.data || [];

      // console.log('Tất cả thiết bị từ API:', allDevices);

      const userDevices = allDevices.filter(device =>
        device.members?.some(member => member.userId === idUser),
      );

      // console.log('Thiết bị của user:', userDevices);
      setDevices(userDevices);
    } catch (err) {
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || 'Lỗi khi lấy dữ liệu thiết bị');
      setDevices([]);
    }
  }, [idUser]);

  // Tải idUser khi màn hình được mount
  useEffect(() => {
    loadIdUser();
  }, [loadIdUser]);

  // Tải thiết bị và thiết lập interval khi có idUser
  useEffect(() => {
    if (idUser) {
      fetchDevices();
      const interval = setInterval(() => {
        fetchDevices();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [idUser, fetchDevices]);

  // Điều hướng sang ReportDetail
  const handleGoToDetail = item => {
    // console.log('Device data when navigating:', item);
    navigation.navigate('ReportDetail', { deviceId: item.id_esp || item._id });
  };

  // Lấy hình ảnh thiết bị
  const getDeviceImage = device => {
    if (device.img_area) {
      return { uri: device.img_area };
    }
    return require('../../../assets/img/1.png');
  };

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
          <Text style={styles.textHeader}>{t('data_analysis')}</Text>
        </View>
      </View>
      <View style={styles.container}>
        {error ? (
          <Text style={styles.errorText}>{t('error')}: {error}</Text>
        ) : devices.length === 0 ? (
          <Text style={styles.emptyText}>{t('no_devices')}</Text>
        ) : (
          <FlatList
            data={devices}
            numColumns={2}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.itemWrapper}>
                <ItemArea
                  nameArea={item.name_area || t('itemAreaDefaultName')}
                  imageSource={getDeviceImage(item)}
                  onPress={() => handleGoToDetail(item)}
                />
              </View>
            )}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={<View style={{height: 50}} />}
          />
        )}
      </View>
    </View>
  );
};

const ItemArea = ({ nameArea, imageSource, onPress }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const styles = createStyle(theme); 
  return (
    <TouchableOpacity style={styles.frameItem} onPress={onPress}>
      <Image style={styles.img} source={imageSource} blurRadius={1} />
      <View style={styles.overlay}>
        <Icon
          name="bar-chart-outline"
          size={28}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.txtArea}>{nameArea}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ReportScreen);
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllDevices } from '../../../services/deviceServices';

const screenWidth = Dimensions.get('window').width;
const itemSpacing = 10;
const itemWidth = screenWidth - itemSpacing * 2;

const SensorThresholdScreen = ({ navigation, route }) => {
  const [devices, setDevices] = useState([]);
  const [thresholds, setThresholds] = useState({}); // Lưu ngưỡng: { [id_esp]: { humidity: [min, max], temperature: [min, max], light: [min, max] } }
  const [idUser, setIdUser] = useState(null);
  const [error, setError] = useState(null);

  // Lấy idUser từ AsyncStorage
  const loadIdUser = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setIdUser(parsedData.idUser || route.params?.idUser || '67f9ff224c36c6ad57e60434');
      } else {
        setIdUser(route.params?.idUser || '67f9ff224c36c6ad57e60434');
      }
    } catch (err) {
      console.error('Lỗi khi lấy idUser:', err);
      setIdUser(route.params?.idUser || '67f9ff224c36c6ad57e60434');
    }
  }, [route.params?.idUser]);

  // Lấy danh sách thiết bị
  const fetchDevices = useCallback(async () => {
    if (!idUser) return;

    try {
      setError(null);
      const response = await getAllDevices();
      const allDevices = response?.data || [];

      // console.log('Tất cả thiết bị từ API:', allDevices);

      // Lọc thiết bị theo idUser
      const filteredDevices = allDevices
        .filter(device => device.members?.some(member => member.userId === idUser))
        .map(device => ({
          id: device._id,
          id_esp: device.id_esp,
          name: device.name_area || `Khu vực ${device._id.slice(-4)}`,
          imageSource: { uri: device.img_area } || require('../../../assets/img/1.png'),
        }));

      // Khởi tạo ngưỡng mặc định cho mỗi thiết bị
      const initialThresholds = {};
      filteredDevices.forEach(device => {
        initialThresholds[device.id_esp] = {
          humidity: [0, 100], // Độ ẩm: 0-100%
          temperature: [0, 50], // Nhiệt độ: 0-50°C
          light: [0, 1000], // Ánh sáng: 0-1000 lux
        };
      });

      setDevices(filteredDevices);
      setThresholds(initialThresholds);
      // console.log('Danh sách thiết bị:', filteredDevices);
    } catch (err) {
      console.error('Lỗi khi lấy thiết bị:', err.message);
      setError(err.response?.data?.message || 'Lỗi khi lấy dữ liệu thiết bị');
      setDevices([]);
    }
  }, [idUser]);

  useEffect(() => {
    loadIdUser();
  }, [loadIdUser]);

  useEffect(() => {
    if (idUser) {
      fetchDevices();
    }
  }, [idUser, fetchDevices]);

  // Xử lý thay đổi ngưỡng
  const handleThresholdChange = (id_esp, sensorType, values) => {
    setThresholds(prev => ({
      ...prev,
      [id_esp]: {
        ...prev[id_esp],
        [sensorType]: values,
      },
    }));
  };

  // Lưu ngưỡng vào AsyncStorage
  const saveThreshold = async (id_esp) => {
    try {
      await AsyncStorage.setItem(
        `threshold_${id_esp}`,
        JSON.stringify(thresholds[id_esp])
      );
      console.log(`Đã lưu ngưỡng cho ${id_esp}:`, thresholds[id_esp]);
    } catch (err) {
      console.error('Lỗi khi lưu ngưỡng:', err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Image source={item.imageSource} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.idEsp}>ID: {item.id_esp}</Text>
        </View>
      </View>
      {/* Slider cho độ ẩm */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>
          Độ ẩm: {thresholds[item.id_esp]?.humidity?.[0] || 0}% -{' '}
          {thresholds[item.id_esp]?.humidity?.[1] || 100}%
        </Text>
        <MultiSlider
          values={thresholds[item.id_esp]?.humidity || [0, 100]}
          sliderLength={itemWidth - 40}
          onValuesChange={values => handleThresholdChange(item.id_esp, 'humidity', values)}
          min={0}
          max={100}
          step={1}
          allowOverlap={false}
          snapped
          trackStyle={styles.track}
          selectedStyle={styles.selectedTrack}
          markerStyle={styles.marker}
        />
      </View>
      {/* Slider cho nhiệt độ */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>
          Nhiệt độ: {thresholds[item.id_esp]?.temperature?.[0] || 0}°C -{' '}
          {thresholds[item.id_esp]?.temperature?.[1] || 50}°C
        </Text>
        <MultiSlider
          values={thresholds[item.id_esp]?.temperature || [0, 50]}
          sliderLength={itemWidth - 40}
          onValuesChange={values => handleThresholdChange(item.id_esp, 'temperature', values)}
          min={0}
          max={50}
          step={1}
          allowOverlap={false}
          snapped
          trackStyle={styles.track}
          selectedStyle={styles.selectedTrack}
          markerStyle={styles.marker}
        />
      </View>
      {/* Slider cho ánh sáng */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>
          Ánh sáng: {thresholds[item.id_esp]?.light?.[0] || 0} lux -{' '}
          {thresholds[item.id_esp]?.light?.[1] || 1000} lux
        </Text>
        <MultiSlider
          values={thresholds[item.id_esp]?.light || [0, 1000]}
          sliderLength={itemWidth - 40}
          onValuesChange={values => handleThresholdChange(item.id_esp, 'light', values)}
          min={0}
          max={1000}
          step={10}
          allowOverlap={false}
          snapped
          trackStyle={styles.track}
          selectedStyle={styles.selectedTrack}
          markerStyle={styles.marker}
        />
      </View>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => saveThreshold(item.id_esp)}
      >
        <Text style={styles.saveButtonText}>Lưu ngưỡng</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cài đặt ngưỡng sensor</Text>
      {error ? (
        <Text style={styles.error}>Lỗi: {error}</Text>
      ) : devices.length === 0 ? (
        <Text style={styles.empty}>Không có thiết bị nào</Text>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default SensorThresholdScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    padding: itemSpacing,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: itemSpacing,
    padding: 15,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  idEsp: {
    fontSize: 14,
    color: '#555',
  },
  sliderContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  track: {
    height: 4,
    backgroundColor: '#ccc',
  },
  selectedTrack: {
    backgroundColor: '#4CAF50',
  },
  marker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
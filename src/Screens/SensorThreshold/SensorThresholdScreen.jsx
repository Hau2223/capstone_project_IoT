import React, {useState, useEffect, useCallback, useContext, memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {getUserDevices} from '../../../services/deviceServices';
import colors from '../../../assets/common/colorCss';
import {updateThreshold} from '../../../services/controlServices';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';
import {useTranslation} from 'react-i18next';

const screenWidth = Dimensions.get('window').width;
const itemSpacing = 10;
const itemWidth = screenWidth - itemSpacing * 2;

const SensorThresholdScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const [devices, setDevices] = useState([]);
  const [thresholds, setThresholds] = useState({});
  const [members, setMembers] = useState({}); // State để lưu thông tin members theo id_esp
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  // Lấy danh sách thiết bị
  const fetchDevices = useCallback(async () => {
    try {
      setError(null);
      const response = await getUserDevices();
      if (response.status === 200) {
        const allDevices = response?.data || [];

        // Ánh xạ thiết bị
        const filteredDevices = allDevices.map(device => ({
          id: device?._id,
          id_esp: device?.id_esp,
          name:
            device?.name_area ||
            `Khu vực ${device?._id?.slice(-4) || 'Unknown'}`,
          imageSource: device?.img_area
            ? {uri: device?.img_area}
            : require('../../../assets/img/1.png'),
        }));

        // Khởi tạo ngưỡng và thông tin members
        const initialThresholds = {};
        const initialMembers = {};
        filteredDevices.forEach(device => {
          const deviceData = allDevices.find(d => d.id_esp === device.id_esp);
          const controls = deviceData?.controls || [];
          const deviceMembers = deviceData?.members || [];

          // Mặc định ngưỡng nếu không có controls
          initialThresholds[device.id_esp] = {
            humidity: {values: [0, 100], controlId: null},
            temperature: {values: [0, 100], controlId: null},
            light: {values: [0, 100], controlId: null},
          };

          // Ánh xạ ngưỡng từ controls
          controls.forEach(control => {
            if (control.name === 'water') {
              initialThresholds[device.id_esp].humidity = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
            } else if (control.name === 'light') {
              initialThresholds[device.id_esp].light = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
            } else if (control.name === 'wind') {
              initialThresholds[device.id_esp].temperature = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
            }
          });

          // Lưu thông tin members theo id_esp
          initialMembers[device.id_esp] = deviceMembers;
          // console.log(`Members cho ${device.id_esp}:`, deviceMembers);
        });

        setDevices(filteredDevices);
        setThresholds(initialThresholds);
        setMembers(initialMembers);
      } else {
        throw new Error('Không thể lấy danh sách thiết bị');
      }
    } catch (err) {
      console.error('Lỗi khi lấy thiết bị:', err.message);
      setError(err.response?.data?.message || 'Lỗi khi lấy dữ liệu thiết bị');
      setDevices([]);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Xử lý thay đổi ngưỡng
  const handleThresholdChange = (id_esp, sensorType, values) => {
    setThresholds(prev => ({
      ...prev,
      [id_esp]: {
        ...prev[id_esp],
        [sensorType]: {
          ...prev[id_esp][sensorType],
          values: values,
        },
      },
    }));
  };

  // Kiểm tra quyền trước khi lưu ngưỡng
  const saveThreshold = async id_esp => {
    // Kiểm tra quyền owner
    const deviceMembers = members[id_esp] || [];
    const currentUser = deviceMembers.find(
      member => member.isCurrentUser && member.role === 'owner',
    );

    if (!currentUser) {
      Alert.alert(
        t('alert_error'),
        t('permission_denied_threshold'),
      );
      return;
    }

    setLoading(true);
    try {
      const thresholdData = thresholds[id_esp];
      const updatePromises = [
        updateThreshold({
          id_esp,
          controlId: thresholdData.humidity.controlId,
          threshold_min: thresholdData.humidity.values[0],
          threshold_max: thresholdData.humidity.values[1],
          mode: 'threshold',
        }),
        updateThreshold({
          id_esp,
          controlId: thresholdData.temperature.controlId,
          threshold_min: thresholdData.temperature.values[0],
          threshold_max: thresholdData.temperature.values[1],
          mode: 'threshold',
        }),
        updateThreshold({
          id_esp,
          controlId: thresholdData.light.controlId,
          threshold_min: thresholdData.light.values[0],
          threshold_max: thresholdData.light.values[1],
          mode: 'threshold',
        }),
      ];

      await Promise.all(updatePromises);
      // Kiểm tra tất cả các yêu cầu có thành công không
      // Lưu ý: Kiểm tra `result._j?.message` có thể không chính xác, tùy thuộc vào cấu trúc phản hồi thực tế của API
      await fetchDevices();
      Alert.alert('Thành công', 'Đã lưu ngưỡng thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu ngưỡng:', err.message);
      Alert.alert('Lỗi', 'Không thể lưu ngưỡng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    // Kiểm tra quyền để vô hiệu hóa nút lưu nếu không phải owner
    const deviceMembers = members[item.id_esp] || [];
    const isOwner = deviceMembers.some(
      member => member.isCurrentUser && member.role === 'owner',
    );

    return (
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
            {t('moisture_label')} {thresholds[item.id_esp]?.humidity?.values?.[0] || 0}% -{' '}
            {thresholds[item.id_esp]?.humidity?.values?.[1] || 100}%
          </Text>
          <MultiSlider
            values={thresholds[item.id_esp]?.humidity?.values || [0, 100]}
            sliderLength={itemWidth - 40}
            onValuesChange={values =>
              handleThresholdChange(item.id_esp, 'humidity', values)
            }
            min={0}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            trackStyle={styles.track}
            selectedStyle={styles.selectedTrack}
            markerStyle={styles.marker}
            disabled={loading || !isOwner} // Vô hiệu hóa slider nếu không phải owner
          />
        </View>
        {/* Slider cho nhiệt độ */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            {t('temperature_label')} {thresholds[item.id_esp]?.temperature?.values?.[0] || 0}°C
            - {thresholds[item.id_esp]?.temperature?.values?.[1] || 50}°C
          </Text>
          <MultiSlider
            values={thresholds[item.id_esp]?.temperature?.values || [0, 50]}
            sliderLength={itemWidth - 40}
            onValuesChange={values =>
              handleThresholdChange(item.id_esp, 'temperature', values)
            }
            min={0}
            max={100}
            step={1}
            allowOverlap={false}
            snapped
            trackStyle={styles.track}
            selectedStyle={styles.selectedTrack}
            markerStyle={styles.marker}
            disabled={loading || !isOwner} // Vô hiệu hóa slider nếu không phải owner
          />
        </View>
        {/* Slider cho ánh sáng */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            {t('light_label')} {thresholds[item.id_esp]?.light?.values?.[0] || 0} lux -{' '}
            {thresholds[item.id_esp]?.light?.values?.[1] || 1000} lux
          </Text>
          <MultiSlider
            values={thresholds[item.id_esp]?.light?.values || [0, 1000]}
            sliderLength={itemWidth - 40}
            onValuesChange={values =>
              handleThresholdChange(item.id_esp, 'light', values)
            }
            min={0}
            max={100}
            step={10}
            allowOverlap={false}
            snapped
            trackStyle={styles.track}
            selectedStyle={styles.selectedTrack}
            markerStyle={styles.marker}
            disabled={loading || !isOwner} // Vô hiệu hóa slider nếu không phải owner
          />
        </View>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (loading || !isOwner) && styles.saveButtonDisabled,
          ]}
          onPress={() => saveThreshold(item.id_esp)}
          disabled={loading || !isOwner} // Vô hiệu hóa nút lưu nếu không phải owner
        >
          <Text style={styles.saveButtonText}>
            {loading ? t('saving') : t('save')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{t('alert_error')}: {error}</Text>
      ) : devices.length === 0 ? (
        <Text style={styles.empty}>{t('no_devices')}</Text>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      )}
    </View>
  );
};

export default memo(SensorThresholdScreen);



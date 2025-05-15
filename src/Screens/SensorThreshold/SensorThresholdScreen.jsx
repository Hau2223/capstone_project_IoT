import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  memo,
  useRef,
} from 'react';
import {
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
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const screenWidth = Dimensions.get('window').width;
const itemSpacing = 10;
const itemWidth = screenWidth - itemSpacing * 2;

const SensorThresholdScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const [devices, setDevices] = useState([]);
  const [thresholds, setThresholds] = useState({});
  const [localThresholds, setLocalThresholds] = useState({});
  const [members, setMembers] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isInitialFetch = useRef(true); // Sử dụng useRef để theo dõi lần fetch đầu tiên

  const fetchDevices = useCallback(async () => {
    try {
      setError(null);
      const response = await getUserDevices();
      if (response.status === 200) {
        const allDevices = response?.data || [];

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

        const newThresholds = {};
        const newLocalThresholds = {};
        const newMembers = {};
        filteredDevices.forEach(device => {
          const deviceData = allDevices.find(d => d.id_esp === device.id_esp);
          const controls = deviceData?.controls || [];
          const deviceMembers = deviceData?.members || [];

          newThresholds[device.id_esp] = {
            humidity: {values: [0, 100], controlId: null},
            temperature: {values: [0, 100], controlId: null},
            light: {values: [0, 100], controlId: null},
          };
          newLocalThresholds[device.id_esp] = {
            humidity: {values: [0, 100], controlId: null},
            temperature: {values: [0, 100], controlId: null},
            light: {values: [0, 100], controlId: null},
          };

          controls.forEach(control => {
            if (control.name === 'water') {
              newThresholds[device.id_esp].humidity = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
              newLocalThresholds[device.id_esp].humidity = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
            } else if (control.name === 'light') {
              newThresholds[device.id_esp].light = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
              newLocalThresholds[device.id_esp].light = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
            } else if (control.name === 'wind') {
              newThresholds[device.id_esp].temperature = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
              newLocalThresholds[device.id_esp].temperature = {
                values: [control.threshold_min, control.threshold_max],
                controlId: control._id,
              };
            }
          });

          newMembers[device.id_esp] = deviceMembers;
        });

        // Chỉ cập nhật state nếu dữ liệu thay đổi
        if (JSON.stringify(devices) !== JSON.stringify(filteredDevices)) {
          setDevices(filteredDevices);
        }
        if (isInitialFetch.current) {
          setThresholds(newThresholds);
          setLocalThresholds(newLocalThresholds);
          isInitialFetch.current = false;
        } else if (
          JSON.stringify(thresholds) !== JSON.stringify(newThresholds)
        ) {
          setThresholds(newThresholds);
          setLocalThresholds(newLocalThresholds);
          Toast.show({
            type: 'info',
            text1: t('alert_info'),
            text2: t('threshold_updated_by_other_device'),
            text1Style: {fontSize: 16, color: colors.black},
            text2Style: {fontSize: 12, color: colors.black},
            position: 'top',
            autoHide: true,
            visibilityTime: 2500,
          });
        }
        if (JSON.stringify(members) !== JSON.stringify(newMembers)) {
          setMembers(newMembers);
        }
      } else {
        throw new Error('Không thể lấy danh sách thiết bị');
      }
    } catch (err) {
      console.error('Lỗi khi lấy thiết bị:', err.message);
      setError(err.response?.data?.message || 'Lỗi khi lấy dữ liệu thiết bị');
      setDevices([]);
    }
  }, [devices, thresholds, members, t]);

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
      const intervalId = setInterval(() => {
        fetchDevices();
      }, 5000);
      return () => clearInterval(intervalId);
    }, [fetchDevices]),
  );

  const handleThresholdChange = (id_esp, sensorType, values) => {
    setLocalThresholds(prev => ({
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

  const saveThreshold = async id_esp => {
    setLoading(true);
    try {
      const thresholdData = localThresholds[id_esp];
      const updatePromises = [];

      if (
        thresholdData.humidity.values[0] !==
          thresholds[id_esp]?.humidity?.values[0] ||
        thresholdData.humidity.values[1] !==
          thresholds[id_esp]?.humidity?.values[1]
      ) {
        updatePromises.push(
          updateThreshold({
            id_esp,
            controlId: thresholds[id_esp]?.humidity?.controlId,
            threshold_min: thresholdData.humidity.values[0],
            threshold_max: thresholdData.humidity.values[1],
          }),
        );
      }

      if (
        thresholdData.temperature.values[0] !==
          thresholds[id_esp]?.temperature?.values[0] ||
        thresholdData.temperature.values[1] !==
          thresholds[id_esp]?.temperature?.values[1]
      ) {
        updatePromises.push(
          updateThreshold({
            id_esp,
            controlId: thresholds[id_esp]?.temperature?.controlId,
            threshold_min: thresholdData.temperature.values[0],
            threshold_max: thresholdData.temperature.values[1],
          }),
        );
      }

      if (
        thresholdData.light.values[0] !==
          thresholds[id_esp]?.light?.values[0] ||
        thresholdData.light.values[1] !== thresholds[id_esp]?.light?.values[1]
      ) {
        updatePromises.push(
          updateThreshold({
            id_esp,
            controlId: thresholds[id_esp]?.light?.controlId,
            threshold_min: thresholdData.light.values[0],
            threshold_max: thresholdData.light.values[1],
          }),
        );
      }

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        await fetchDevices(); // Gọi lại fetch để cập nhật thresholds sau khi lưu thành công
        Toast.show({
          type: 'success',
          text1: t('alert_success'),
          text2: t('success_thresshold'),
          text1Style: {fontSize: 16, color: colors.primary},
          text2Style: {fontSize: 12, color: colors.black},
          position: 'top',
          autoHide: true,
          visibilityTime: 2500,
        });
      } else {
        Toast.show({
          type: 'info',
          text1: t('alert_info'),
          text2: t('thresshold_no_change'),
          text1Style: {fontSize: 16, color: colors.black},
          text2Style: {fontSize: 12, color: colors.black},
          position: 'top',
          autoHide: true,
          visibilityTime: 2500,
        });
      }
    } catch (err) {
      Toast.show({
        type: 'err',
        text1: t('alert_info'),
        text2: t('thresshold_no_change'),
        text1Style: {fontSize: 16, color: colors.black},
        text2Style: {fontSize: 12, color: colors.black},
        position: 'top',
        autoHide: true,
        visibilityTime: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    const deviceMembers = members[item.id_esp] || [];

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Image source={item.imageSource} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>
        {/* Slider cho độ ẩm */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            {t('moisture_label')}{' '}
            {localThresholds[item.id_esp]?.humidity?.values?.[0] || 0}% -{' '}
            {localThresholds[item.id_esp]?.humidity?.values?.[1] || 100}%
          </Text>
          <MultiSlider
            values={localThresholds[item.id_esp]?.humidity?.values || [0, 100]}
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
          />
        </View>
        {/* Slider cho nhiệt độ */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            {t('temperature_label')}{' '}
            {localThresholds[item.id_esp]?.temperature?.values?.[0] || 0}°C -{' '}
            {localThresholds[item.id_esp]?.temperature?.values?.[1] || 50}°C
          </Text>
          <MultiSlider
            values={
              localThresholds[item.id_esp]?.temperature?.values || [0, 50]
            }
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
          />
        </View>
        {/* Slider cho ánh sáng */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            {t('light_label')}{' '}
            {localThresholds[item.id_esp]?.light?.values?.[0] || 0} lux -{' '}
            {localThresholds[item.id_esp]?.light?.values?.[1] || 1000} lux
          </Text>
          <MultiSlider
            values={localThresholds[item.id_esp]?.light?.values || [0, 1000]}
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
          />
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => saveThreshold(item.id_esp)}>
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>
          {t('alert_error')}: {error}
        </Text>
      ) : devices.length === 0 ? (
        <Text style={styles.empty}>{t('no_devices')}</Text>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          extraData={localThresholds} // Theo dõi localThresholds để re-render khi slider thay đổi
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{height: 20}} />}
        />
      )}
    </View>
  );
};

export default memo(SensorThresholdScreen);

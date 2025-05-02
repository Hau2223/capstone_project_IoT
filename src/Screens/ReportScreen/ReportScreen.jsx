import {
  onPress,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect, useCallback, useContext} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {getAllDevices} from '../../../services/deviceServices';
import {profile} from '../../../services/authServices';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import colors from '../../../assets/common/colorCss';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';

const ReportScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  // const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [idUser, setIdUser] = useState(null);

  useEffect(() => {
    const loadIdUser = async () => {
      try {
        const response = await profile();
        if (response?.data) {
          setIdUser(response.data._id);
        }
      } catch (err) {
        console.error('Lỗi khi lấy idUser:', err);
      }
    };
    loadIdUser();
  }, []);

  useEffect(() => {
    if (idUser) {
      fetchDevices();
      const interval = setInterval(() => {
        fetchDevices();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [idUser, fetchDevices]);

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

  useEffect(() => {
    if (idUser) {
      fetchDevices();
      const interval = setInterval(() => {
        fetchDevices();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [idUser, fetchDevices]);

  const handleGoToDetail = item => {
    navigation.navigate('ReportDetail', {item});
  };

  const getDeviceImage = device => {
    // Nếu thiết bị có hình ảnh từ API, sử dụng nó
    if (device.img_area) {
      return {uri: device.img_area};
    }
    // Nếu không có, sử dụng hình mặc định
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
          <Text style={styles.textHeader}>Phân tích dữ liệu</Text>
        </View>
      </View>
      <View style={styles.container}>
        {error ? (
          <Text style={styles.errorText}>Lỗi: {error}</Text>
        ) : devices.length === 0 ? (
          <Text style={styles.emptyText}>Không có thiết bị nào</Text>
        ) : (
          <FlatList
            data={devices}
            numColumns={2}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <View style={styles.itemWrapper}>
                <ItemArea
                  nameArea={item.name_area || 'Thiết bị không tên'}
                  imageSource={getDeviceImage(item)}
                  onPress={() => handleGoToDetail(item)}
                />
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
};

const ItemArea = ({nameArea, imageSource, onPress}) => {
  return (
    <TouchableOpacity style={styles.frameItem} onPress={onPress}>
      <Image style={styles.img} source={imageSource} blurRadius={1} />
      <View style={styles.overlay}>
        <Icon
          name="bar-chart-outline"
          size={30}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.txtArea}>{nameArea}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  frame: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.white,
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
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  container: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  frameItem: {
    height: 200,
    width: '100%',
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  img: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  icon: {
    marginBottom: 10,
  },
  txtArea: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemWrapper: {
    alignItems: 'center',
    width: '50%', // Each item takes exactly 50% of the layout
    paddingHorizontal: 5,
    marginVertical: 5, // Maintain vertical spacing between rows
  },
  listContainer: {
    paddingBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

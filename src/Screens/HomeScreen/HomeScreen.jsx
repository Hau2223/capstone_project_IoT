import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback, memo} from 'react';
import ItemHomePage from '../../components/ItemHomePage';
import CustomAlert from '../../components/CustomAlert';
import {profile} from '../../../services/authServices';

const data = [
  {
    id: '1',
    tenKhu: '1',
    nhietDo: '19°C',
    doAm: '25%',
    trangThaiTuoi: 'OFF',
    quat: 'ON',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '20%',
  },
  {
    id: '2',
    tenKhu: '2',
    nhietDo: '21°C',
    doAm: '30%',
    trangThaiTuoi: 'ON',
    quat: 'OFF',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '30%',
  },
  {
    id: '3',
    tenKhu: '3',
    nhietDo: '18°C',
    doAm: '28%',
    trangThaiTuoi: 'OFF',
    quat: 'ON',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '10%',
  },
  {
    id: '4',
    tenKhu: '4',
    nhietDo: '20°C',
    doAm: '35%',
    trangThaiTuoi: 'ON',
    quat: 'OFF',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '20%',
  },
  {
    id: '5',
    tenKhu: '5',
    nhietDo: '22°C',
    doAm: '40%',
    trangThaiTuoi: 'OFF',
    quat: 'ON',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '30%',
  },
  {
    id: '6',
    tenKhu: '6',
    nhietDo: '22°C',
    doAm: '40%',
    trangThaiTuoi: 'OFF',
    quat: 'ON',
    imageSource: require('../../../assets/img/1.png'),
    anhSang: '40%',
  },
];

const HomeScreen = ({navigation}) => {
  //const [name, setName] = useState("hú");
  const [modalVisible, setModalVisible] = useState(false);
  const handleGoToDetail = item => {
    navigation.navigate('DetailScreen', {item}); // Chuyển dữ liệu sang DetailItem
  };

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const data = await profile();
      setUserInfo(data.data);
    } catch (err) {
      setError(err.message || 'Error fetching user data');
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  }, [error]); // Mảng phụ thuộc rỗng để không tạo ra một hàm mới mỗi lần render

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]); // Đưa fetchUserProfile vào mảng phụ thuộc
  const showAlert = () => {
    Alert.alert('Thông báo', 'Đây là nội dung thông báo!', [{text: 'OK'}]);
  };
  console.log(userInfo);

  return (
    <View style={styles.frame}>
      <View style={styles.header}>
        <View style={styles.header1}>
          <Text style={styles.textHeader}>Vườn tiêu Bình Phước</Text>
        </View>
        <TouchableOpacity
          style={styles.header2}
          onPress={() => setModalVisible(true)}>
          <Image
            source={require('../../../assets/icon/canhBao.png')}
            style={styles.alertIcon}
          />
        </TouchableOpacity>
        <CustomAlert
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.itemWrapper}>
              <ItemHomePage
                tenKhu={'Khu ' + item.tenKhu}
                nhietDo={'Nhiệt độ: ' + item.nhietDo}
                doAm={'Độ ẩm: ' + item.doAm}
                trangThaiTuoi={'Trạng thái tưới: ' + item.trangThaiTuoi}
                quat={'Quạt: ' + item.quat}
                imageSource={item.imageSource}
                anhSang={item.anhSang}
                onPress={() => handleGoToDetail(item)}
              />
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  frame: {
    height: 'auto',
    width: '100%',
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
  container: {
    height: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 230,
  },
  itemWrapper: {
    alignItems: 'center',
    width: '50%',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default memo(HomeScreen);

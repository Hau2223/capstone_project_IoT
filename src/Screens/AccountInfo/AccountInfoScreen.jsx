import React, {useState, useCallback, memo, useContext} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  LogBox,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/AntDesign';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStyle} from './style';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {IMAGES} from '../../../utils/constants';
import HeaderCompo from '../../components/HeaderCompo';
import DeviceInfo from 'react-native-device-info';
import {detailDevice} from '../../../services/deviceServices';
import {gardenId} from '../../../services/authServices';
import colors from '../../../assets/common/colorCss';

LogBox.ignoreAllLogs();

const AccountInfoScreen = ({navigation, route}) => {
  const {userInfo, fetchUserProfile} = route.params;
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();

  const [currentUserInfo, setCurrentUserInfo] = useState(userInfo); // State mới để lưu userInfo
  const [garden, setGarden] = useState([]);

  const fetchGarder = useCallback(async () => {
    try {
      const res = await gardenId();
      if (res.status === 200) {
        const dataGarden = await Promise.all(
          res.data.map(async id => {
            const deviceData = await detailDevice({id});
            return deviceData;
          }),
        );
        setGarden(dataGarden);
      }
    } catch (err) {
      console.error(err.message || 'Error fetching user data');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const userData = await fetchUserProfile(); // Gọi và nhận dữ liệu mới
        if (userData) {
          setCurrentUserInfo(userData);  // Cập nhật userInfo mới
        }
        fetchGarder();
      };

      fetchData();
    }, [fetchUserProfile, fetchGarder]),
  );

  const profileFields = [
    {label: 'Họ tên', value: currentUserInfo?.name, icon: 'account'},
    {label: 'Email', value: currentUserInfo?.email, icon: 'email'},
    {label: 'Số điện thoại', value: currentUserInfo?.phone, icon: 'phone'},
    {label: 'Địa chỉ', value: currentUserInfo?.address, icon: 'map-marker'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
      )}
      <HeaderCompo
        name="Thông tin cá nhân"
        isPress={() => navigation.goBack()}
        bgcolor={theme === 'light' ? colors.white : colors.bg_dark}
        color={theme === 'light' ? colors.bg_dark : colors.white}
      />
      <ScrollView
        style={{width: '100%', height: '100%'}}
        contentContainerStyle={{
          gap: 15,
          alignItems: 'center',
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}>
        <Animatable.View
          style={styles.layoutImg}
          animation="zoomIn"
          duration={1500}>
          <View style={styles.bgImg}>
            <Image
              style={styles.imgProfile}
              source={{
                uri: currentUserInfo?.avatar ? currentUserInfo.avatar : IMAGES.IMAGES_H,
              }}
            />
            <View style={styles.txtInfo}>
              <Text style={styles.txtWelcome}>Xin chào,</Text>
              <Text
                style={[styles.txtWelcome, styles.txtName]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {currentUserInfo?.name}
              </Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View
          style={styles.layoutContent}
          animation="slideInUp"
          duration={1500}>
          <View style={styles.layoutBody}>
            <Text style={styles.txtTitle}>Hồ sơ của bạn</Text>
            <Pressable
              style={styles.editbtn}
              onPress={() => navigation.navigate('EditProfile', { userInfo: currentUserInfo })}>
              <Icon name="edit" size={20} />
            </Pressable>
          </View>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              paddingHorizontal: 5,
              gap: 5,
            }}>
            {profileFields.map((item, index) => (
              <View key={index} style={styles.rowItem}>
                <Text style={styles.label}>
                  <IconMa name={item.icon} size={18} color={colors.white} />{' '}
                  {item.label}:
                </Text>
                <Text style={styles.value} numberOfLines={1}>
                  {item.value || 'Chưa cập nhật'}
                </Text>
              </View>
            ))}
          </View>
        </Animatable.View>
        
        <Animatable.View
          style={styles.layoutContent}
          animation="slideInUp"
          duration={1500}>
          <View style={styles.layoutBody}>
            <Text style={styles.txtTitle}>Khu vườn của bạn</Text>
          </View>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              paddingHorizontal: 5,
              gap: 5,
            }}>
            {garden.length > 0 ? (
              garden.map((item, index) => (
                <View key={index} style={styles.rowItem}>
                  <Text style={styles.label}>
                    <IconMa
                      name="flower-tulip-outline"
                      size={20}
                      color="#fff"
                      style={{marginRight: 5}}
                    />{' '}
                    {item.data?.name_area || 'Không có tên'}
                  </Text>
                  <Text style={styles.label}>
                    <IconMa name="account-group" size={16} color="#fff" />{' '}
                    {item.data?.members?.length ?? 0}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.label}>Chưa có khu vườn nào</Text>
            )}
          </View>
        </Animatable.View>
      </ScrollView>
      <Animatable.View
        style={styles.versionContainer}
        animation="zoomIn"
        duration={1500}>
        <Text style={styles.versionText}>
          Phiên bản sử dụng: {DeviceInfo.getVersion()}
        </Text>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default memo(AccountInfoScreen);
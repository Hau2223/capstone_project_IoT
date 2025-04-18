import React, {useState, useCallback, useEffect, memo, useContext} from 'react';
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
import {useIsFocused} from '@react-navigation/native';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {IMAGES} from '../../../utils/constants';
import HeaderCompo from '../../components/HeaderCompo';
import DeviceInfo from 'react-native-device-info';
import {detailDevice} from '../../../services/deviceServices';
import {gardenId} from '../../../services/authServices';
import colors from '../../../assets/common/colorCss';
LogBox.ignoreAllLogs();

const AccountInfoScreen = ({navigation, route}) => {
  const {userInfo} = route.params;
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();

  const [garden, SetGarden] = useState([]);

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
    if (isFocused) {
      fetchGarder();
      const interval = setInterval(() => {
        fetchGarder();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isFocused]);

  const profileFields = [
    {label: 'Họ tên', value: userInfo?.name, icon: 'account'},
    {label: 'Email', value: userInfo?.email, icon: 'email'},
    {label: 'Số điện thoại', value: userInfo?.phone, icon: 'phone'},
    {label: 'Địa chỉ', value: userInfo?.address, icon: 'map-marker'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      {isFocused && (
        <StatusBar backgroundColor={ theme === 'light' ? colors.white : colors.bg_dark}  
        barStyle= {theme === 'light' ? "dark-content" : "light-content"} />
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
                uri: userInfo?.avatar ? userInfo.avatar : IMAGES.IMAGES_H,
              }}
            />
            <View style={styles.txtInfo}>
              <Text style={styles.txtWelcome}>Xin chào,</Text>
              <Text
                style={[styles.txtWelcome, styles.txtName]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {userInfo?.name}
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
            <Pressable style={styles.editbtn} onPress={() => navigation.navigate('EditProfile',{userInfo}) }>
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

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
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {IMAGES} from '../../../utils/constants';
import HeaderCompo from '../../components/HeaderCompo';
import DeviceInfo from 'react-native-device-info';
import {detailDevice} from '../../../services/deviceServices';
import {gardenId, profile} from '../../../services/authServices';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../../assets/common/colorCss';
import {format} from 'date-fns';

LogBox.ignoreAllLogs();

const AccountInfoScreen = ({navigation, route}) => {
  const {userInfo} = route.params;
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const {t} = useTranslation();
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
        const refreshed = await profile();
        if (refreshed) {
          setCurrentUserInfo(refreshed.data);
        }
      };
      fetchData();
      fetchGarder();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }, [fetchGarder]),
  );
  const profileFields = [
    {label: t('name'), value: currentUserInfo?.name, icon: 'account'},
    {label: t('email'), value: currentUserInfo?.email, icon: 'email'},
    {label: t('phone'), value: currentUserInfo?.phone, icon: 'phone'},
    {
      label: t('dob'),
      value: currentUserInfo.dob
        ? format(new Date(currentUserInfo.dob), 'dd/MM/yyyy')
        : '',
      icon: 'calendar-month',
    },
    {label: t('address'), value: currentUserInfo?.address, icon: 'map-marker'},
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
        name={t('account_info')}
        isPress={() => navigation.goBack()}
        bgcolor={theme === 'light' ? colors.white : colors.bg_dark}
        color={theme === 'light' ? colors.primary : colors.white}
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
                uri: currentUserInfo?.avatar
                  ? currentUserInfo?.avatar
                  : IMAGES.IMAGES_DF,
              }}
            />
            <View style={styles.txtInfo}>
              <Text style={styles.txtWelcome}>{t('hello')}</Text>
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
            <Text style={styles.txtTitle}>{t('your_profile')}</Text>
            <Pressable
              style={styles.editbtn}
              onPress={() =>
                navigation.navigate('EditProfile', {userInfo: currentUserInfo})
              }>
              <Icon name="edit" size={22} color={colors.primary} />
            </Pressable>
          </View>
          <View
            style={{
              width: '100%',
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
                  {item.value || t('not_updated')}
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
            <Text style={styles.txtTitle}>{t('your_garden')}</Text>
          </View>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              paddingHorizontal: 5,
              gap: 5,
            }}>
            {garden.length > 0 ? (
              garden.map((item, index) => (
                <View key={index} style={styles.rowItem}>
                  <Text style={styles.labelGarden}>
                    <IconMa
                      name="flower-tulip-outline"
                      size={20}
                      color="#fff"
                      style={{marginRight: 5}}
                    />{' '}
                    {item.data?.name_area}
                  </Text>
                  <Text style={styles.valueGarden}>
                    <IconMa name="account-group" size={16} color="#fff" />{' '}
                    {item.data?.members?.length ?? 0}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.label}>{t('no_garden')}</Text>
            )}
          </View>
        </Animatable.View>
      </ScrollView>
      <Animatable.View
        style={styles.versionContainer}
        animation="zoomIn"
        duration={1500}>
        <Text style={styles.versionText}>
          {t('version')}: {DeviceInfo.getVersion()}
        </Text>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default memo(AccountInfoScreen);

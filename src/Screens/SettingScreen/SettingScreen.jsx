import React, {useState, useEffect, useContext, useCallback, memo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IMAGES} from '../../../utils/constants';
import colors from '../../../assets/common/colorCss';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {createStyle} from './style';
import {logout, profile} from '../../../services/authServices';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Feather';

const SettingsScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, toggleTheme} = useContext(ThemeContext);
  const isFocused = useIsFocused();
  const styles = createStyle(theme);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Trong SettingsScreen
  const fetchUserProfile = useCallback(async () => {
    try {
      const data = await profile();
      setUserInfo(data.data); // Cập nhật userInfo
      return data.data; // Trả về userInfo
    } catch (err) {
      setError(err.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, [setUserInfo, setError]);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile]),
  );

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res.message === 'Logout successful') {
        await AsyncStorage.removeItem('authToken');
        await navigation.navigate('Login');
      }
    } catch (err) {
      console.log('Đăng xuất thất bại');
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      )}
      <View style={styles.profileWrapper}>
        <View style={styles.profileHeader} />
        <View style={styles.avatarWrapper}>
          <Image
            source={{uri: userInfo?.avatar ? userInfo.avatar : IMAGES.IMAGES_H}}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.profileName}>{userInfo?.name}</Text>
        </View>
      </View>

      {/* Danh sách cài đặt */}
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>{t('setting')}</Text>
        <View style={styles.settingBox}>
          <Pressable
            style={styles.optionContainer}
            onPress={() => Alert.alert('Thông Báo, Tính năng chưa phát triển')}>
            <Text style={styles.optionText}>{t('general_settings')}</Text>
          </Pressable>

          <Pressable
            style={styles.optionContainer}
            onPress={() => navigation.navigate('AccountInfo', {userInfo})}>
            <Text style={styles.optionText}>{t('account_info')}</Text>
          </Pressable>

          <Pressable
            style={styles.optionContainer}
            onPress={() => navigation.navigate('ChangePassword')}>
            <Text style={styles.optionText}>{t('change_password')}</Text>
          </Pressable>

          <Pressable style={styles.optionContainer} onPress={toggleTheme}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.optionText}>{t('interface')}</Text>
              <Animatable.View
                animation="bounceIn"
                duration={2500}
                key={theme} // quan trọng: để animation chạy lại khi theme thay đổi
              >
                {/* <Icon
                  name={theme === 'light' ? 'sun' : 'moon'}
                  size={20}
                  color={theme === 'light' ? 'orange' : 'lightblue'}
                  style={{marginRight: 10}}
                /> */}
                <Image
                  source={
                    theme === 'light'
                      ? require('../../../assets/icon/ic_sun.png')
                      : require('../../../assets/icon/ic_moon.png')
                  }
                  style={{height: 30, width: 30}}
                />
              </Animatable.View>
            </View>
          </Pressable>

          <Pressable
            style={styles.optionContainer}
            onPress={() => navigation.navigate('LanguageSetting')}>
            <Text style={styles.optionText}>{t('language')}</Text>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={[styles.optionContainer, {borderBottomWidth: 0}]}>
            <Text style={[styles.optionText, {color: colors.red}]}>
              {t('logout')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default memo(SettingsScreen);

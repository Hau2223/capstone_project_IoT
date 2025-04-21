import React, {useState, useEffect, useContext, useCallback, memo} from 'react';
import {View, Text, Image, TouchableOpacity, StatusBar} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IMAGES} from '../../../utils/constants';
import colors from '../../../assets/common/colorCss';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {createStyle} from './style';
import {profile} from '../../../services/authServices';

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
      const interval = setInterval(() => {
        fetchUserProfile();
      }, 5000);

      return () => clearInterval(interval);
    }, [fetchUserProfile]),
  );

  const changeLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    await navigation.navigate('Login');
    console.log('Đăng xuất thành công');
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
        <Text style={styles.sectionTitle}>Cài đặt</Text>
        <View style={styles.settingBox}>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate('GeneralSetting')}>
            <Text style={styles.optionText}>Cài đặt chung</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() =>
              navigation.navigate('AccountInfo', {userInfo, fetchUserProfile})
            }>
            <Text style={styles.optionText}>Thông tin tài khoản</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate('ChangePassword')}>
            <Text style={styles.optionText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={toggleTheme}>
            <Text style={styles.optionText}>Giao diện</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate('LanguageSetting')}>
            <Text style={styles.optionText}>Ngôn ngữ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.optionContainer, {borderBottomWidth: 0}]}>
            <Text style={[styles.optionText, {color: colors.red}]}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(SettingsScreen);

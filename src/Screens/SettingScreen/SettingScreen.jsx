// import React, {memo, useContext} from 'react';
// import {View, Text, Button, StyleSheet} from 'react-native';
// import {useTranslation} from 'react-i18next';
// import {ThemeContext} from '../../../assets/common/themeProvider';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const SettingScreen = ({navigation}) => {
//   const {t, i18n} = useTranslation();
//   const {theme, toggleTheme} = useContext(ThemeContext);
//   const handleGoBack = async () => {
//     await AsyncStorage.removeItem('authToken');
//     await navigation.navigate('Login');
//     console.log('Đăng xuất thành công');
//   };

//   const changeLanguage = async () => {
//     const newLang = i18n.language === 'en' ? 'vi' : 'en';
//     i18n.changeLanguage(newLang);
//   };

//   return (
//     <View style={[styles.container, theme === 'dark' && styles.darkMode]}>
//       <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
//         {t('setting')}
//       </Text>
//       <Button title={t('change_language')} onPress={changeLanguage} />
//       <Button title={t('dark_mode')} onPress={toggleTheme} />

//       <Text style={styles.text}>{t('logout')}</Text>
//       <Button title={t('logout')} onPress={handleGoBack} />
//     </View>
//   );
// };

// export default memo(SettingScreen);

import React, {useState, useEffect, useContext, useCallback, memo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
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
  const fetchUserProfile = useCallback(async () => {
    try {
      const data = await profile();
      setUserInfo(data.data);
    } catch (err) {
      setError(err.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    const interval = setInterval(() => {
      fetchUserProfile();
    }, 5000);
  
    return () => clearInterval(interval);
  }, []);
  

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
            onPress={() => navigation.navigate('AccountInfo')}>
            <Text style={styles.optionText}>Cài đặt chung</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate('ChangePassword')}>
            <Text style={styles.optionText}>Thông tin tài khoản</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate('GeneralSetting')}>
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.secondary,
//   },
//   profileWrapper: {
//     width: '100%',
//     height: 120,
//     position: 'relative',
//     backgroundColor: colors.primary,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   avatarWrapper: {
//     position: 'absolute',
//     transform: [{translateY: 75}],
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 135,
//     height: 135,
//     borderRadius: 80,
//     borderWidth: 4,
//     borderColor: colors.white,
//   },

//   profileName: {
//     marginTop: 5,
//     fontSize: 20,
//     fontWeight: '600',
//     color: colors.black,
//   },

//   body: {
//     flex: 1,
//     justifyContent: 'center',
//     top: -80,
//     paddingHorizontal: 20,
//     gap: 10,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: colors.primary,
//     alignSelf: 'flex-start',
//   },

//   settingBox: {
//     width: '100%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   optionContainer: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.borderColor,
//   },
//   optionText: {
//     fontSize: 20,
//     fontWeight: '500',
//     color: colors.txtBtnSetting,
//   },
// });

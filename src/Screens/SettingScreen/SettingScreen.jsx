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

import React, {useState, useContext, memo} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IMAGES} from '../../../utils/constants';
import colors from '../../../assets/common/colorCss';

const SettingsScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, toggleTheme} = useContext(ThemeContext);
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
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: IMAGES.IMAGES_H,
          }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.profileName}>Nguyễn Văn A</Text>
      </View>

      {/* Danh sách cài đặt */}
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
  );
};

export default memo(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    paddingTop: 30,
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
  },

  profileContainer: {
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 80,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.txtdefault,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    alignSelf: 'flex-start',
    marginHorizontal: 20,
  },

  settingBox: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  optionText: {
    fontSize: 18,
    color: colors.txtBtnSetting,
  },
});

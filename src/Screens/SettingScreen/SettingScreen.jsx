import React, {memo, useContext} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SettingScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, toggleTheme} = useContext(ThemeContext);
  const handleGoBack = async () => {
    await AsyncStorage.removeItem('authToken');
    await navigation.navigate('Login');
    console.log('Đăng xuất thành công');
  };

  const changeLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkMode]}>
      <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
        {t('setting')}
      </Text>
      <Button title={t('change_language')} onPress={changeLanguage} />
      <Button title={t('dark_mode')} onPress={toggleTheme} />

      <Text style={styles.text}>{t('logout')}</Text>
      <Button title="Go back" onPress={handleGoBack} />
    </View>
  );
};

export default memo(SettingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkMode: {
    backgroundColor: '#222',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
});

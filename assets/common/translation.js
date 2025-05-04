import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n'; // Import i18n đã cấu hình

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Mặc định là Tiếng Anh

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      } else {
        // Nếu không có ngôn ngữ trong AsyncStorage, đặt mặc định là Tiếng Anh
        setLanguage('en');
        i18n.changeLanguage('en');
        await AsyncStorage.setItem('language', 'en');
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async lang => {
    await AsyncStorage.setItem('language', lang);
    setLanguage(lang);
    i18n.changeLanguage(lang); // Cập nhật i18n
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
// LanguageContext.js
import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import vi from './locales/vn.json';

const translations = {
  en,
  vi,
};

export const LanguageContext = createContext();

export const LanguageProvider = ({children}) => {
  const [language, setLanguage] = useState('vi');

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('language');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async lang => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = key => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{t, changeLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

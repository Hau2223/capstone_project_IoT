import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const en = require('../../assets/common/locales/en.json');
const vi = require('../../assets/common/locales/vn.json');

// Tự động phát hiện ngôn ngữ từ AsyncStorage
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const lang = await AsyncStorage.getItem('language');
    callback(lang || 'en'); // Mặc định là Tiếng Anh nếu chưa có
  },
  init: () => {},
  cacheUserLanguage: lang => {
    AsyncStorage.setItem('language', lang);
  },
};

// Khởi tạo i18next
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: 'en', // Ngôn ngữ dự phòng là Tiếng Anh
    interpolation: { escapeValue: false }, // Không escape ký tự đặc biệt
  });

export default i18n;
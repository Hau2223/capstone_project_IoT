import React, {useState, useContext, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../assets/common/colorCss';

const languages = [
  { code: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

const LanguageSettingScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const changeLanguage = async lang => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkMode]}>
      <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
        {t('setting')}
      </Text>
      <FlatList
        data={languages}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.ctnmain}
        renderItem={({item}) => (
          <Pressable
            style={[
              styles.languageItem,
              selectedLang === item.code && styles.selected,
            ]}
            onPress={() => changeLanguage(item.code)}>
            {/* <Image source={item.flag} style={styles.flag} /> */}
            <View style={styles.bodyLan}>
              <Text style={styles.languageFlap}>
                {item.code === 'en' ? '🇬🇧' : '🇻🇳'}
              </Text>
              <Text style={styles.languageText}>
                {item.code === 'en' ? t('areaEN') : t('areaVN')}
              </Text>
            </View>

            <Icon
              name={
                selectedLang === item.code
                  ? 'radiobox-marked'
                  : 'radiobox-blank'
              }
              size={24}
              color={selectedLang === item.code ? 'yellow' : 'white'}
            />
          </Pressable>
        )}
      />
    </View>
  );
};

export default memo(LanguageSettingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // padding: 16,
    gap: 10,
  },
  text: {
    color: colors.black,
    fontSize: 24,
    textAlign: 'center',
  },
  ctnmain: {
    gap: 10,
    marginHorizontal: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#315070',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  selected: {
    borderWidth: 2,
    borderColor: 'yellow',
  },
  flag: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
  },
  bodyLan: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  languageFlap: {
    fontSize: 24,
    color: 'white',
    marginLeft: 5,
  },
  languageText: {
    fontSize: 18,
    color: 'white',
  },
});

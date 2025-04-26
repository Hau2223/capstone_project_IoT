import React, {useState, useContext, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  StatusBar,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../assets/common/colorCss';
import {createStyle} from './style';
import {useIsFocused} from '@react-navigation/native';
import HeaderCompo from '../../components/HeaderCompo';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const languages = [
  {code: 'vi', label: 'Vietnamese', flag: '🇻🇳'},
  {code: 'en', label: 'English', flag: '🇬🇧'},
];

const LanguageSettingScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();

  const changeLanguage = async lang => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkMode]}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
      )}
      <HeaderCompo
        name={t('setting')}
        isPress={() => navigation.goBack()}
        bgcolor={theme === 'light' ? colors.white : colors.bg_dark}
        color={theme === 'light' ? colors.black : colors.white}
      />
      <View style={styles.layoutCurrentLan}>
        <Text style={styles.txtTitleCurrent}>{t('currentLanguage')}</Text>
        <View style={styles.currentLan}>
          <Text style={[styles.txtCurrent, styles.txtFlapCurrent]}>
            {`${languages.find(lang => lang.code === selectedLang)?.flag}`}
          </Text>
          <Text style={[styles.txtCurrent, styles.txtLanCurrent]}>
            {selectedLang === 'en' ? t('areaEN') : t('areaVN')}
          </Text>
        </View>
      </View>
      <View style={styles.layoutChooseLan}>
        <Text style={styles.txtTitleCurrent}>{t('anotherLanguage')}</Text>
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
    </View>
  );
};

export default memo(LanguageSettingScreen);

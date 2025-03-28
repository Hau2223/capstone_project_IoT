import React, {useContext, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import {Switch} from 'react-native-paper';
import colors from '../../assets/common/colorCss';
import IconOc from 'react-native-vector-icons/Octicons';
import {ThemeContext} from '../../assets/common/themeProvider';
import {LanguageContext} from '../../assets/common/translation';
import {scale} from '../../assets/common/scaleScreen';
import {createStyle} from './style';
import {fonts, icons} from '../../assets/common/fontCss';

const SettingScreen = ({navigation}) => {
  const {theme, toggleTheme} = useContext(ThemeContext);
  const {t, changeLanguage, language} = useContext(LanguageContext);
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <View
        style={{
          height: scale(60),
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Pressable
          style={{
            position: 'absolute',
            left: scale(20),
            height: scale(40),
            width: scale(40),
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <IconOc
            name="chevron-left"
            size={icons.IconSize.Medium}
            color={
              theme === 'dark' ? colors.backforMain : colors.textInputMainLight
            }
          />
        </Pressable>
        <Text style={styles.textTitle}>{t('settingChangeLan')}</Text>
      </View>
      <View
        style={{
          width: '100%',
          height: 'auto',
          alignItems: 'center',
          gap: scale(8),
        }}>
        <View style={styles.radioButton}>
          <Text style={styles.textMode}>
            {t('settingChangeAppearance')}{' '}
            {theme === 'dark'
              ? t('settingAppearanceMode2')
              : t('settingAppearanceMode1')}
          </Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{
              false: colors.modeAppearanceFalse,
              true: colors.modeAppearanceTrue,
            }}
            thumbColor={
              theme === 'dark' ? colors.backforMain : colors.modeAppearance3
            }
            // ios_backgroundColor="#3e3e3e"
            style={styles.switch}
          />
        </View>

        <Pressable
          style={styles.btnsetting}
          onPress={() => navigation.navigate('ChangeLan')}>
          <Text
            style={{
              color: colors.textDef,
              fontSize: fonts.FontSize.Medium_X,
              fontWeight: '600',
            }}>
            {t('settingChangeLan')}
          </Text>
          <IconOc
            name="chevron-right"
            size={icons.IconSize.Medium}
            color={colors.textDef}
          />
        </Pressable>

        <Pressable
          style={styles.btnsetting}
          onPress={() => navigation.navigate('AccountSetting')}>
          <Text
            style={{
              color: colors.textDef,
              fontSize: fonts.FontSize.Medium_X,
              fontWeight: '600',
            }}>
            {t('settingAccount')}
          </Text>
          <IconOc
            name="chevron-right"
            size={icons.IconSize.Medium}
            color={colors.textDef}
          />
        </Pressable>
      </View>
      {/* <TouchableOpacity style={{backgroundColor: colors.boxchat, height: scale(55), width: scale(55), borderRadius: scale(30), position: "absolute", bottom: scale(100), right: scale(15),
                alignItems: "center", justifyContent: "center"}}>
                <Image style={{ width: scale(35), height: scale(35), resizeMode: 'cover',}}
                    source={ require('../../assets/icons/i-chat.png')}/>
            </TouchableOpacity> */}
    </View>
  );
};

export default memo(SettingScreen);

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import React, {memo, useContext} from 'react';
import colors from '../../../../assets/common/colorCss';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../../assets/common/themeProvider';
import {createStyle} from '../style';
import LinearGradient from 'react-native-linear-gradient';

const Comfirm = ({email, handleSendCode, handleInputChange, handleEmail}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const handlePress = () => {
    handleEmail();
    handleSendCode();
  };
  return (
    <View style={styles.ceContainer}>
      <View style={styles.ceFormLogin}>
        <Image
          style={styles.ceImg}
          source={require('../../../../assets/icon/ic_logo.png')}
        />
        <Text style={styles.ceTitle}>{t('otp_verification')}</Text>
        <Text style={styles.ceSubText}>{t('otp_send_message')}</Text>
        <View style={styles.ceInputLayout}>
          <Text style={styles.ceFormLabel}>{t('confirm_email')}</Text>
          <TextInput
            value={email}
            onChangeText={text => handleInputChange('email', text)}
            placeholder={t('enter_email')}
            placeholderTextColor={colors.white}
            style={[styles.ceFormLabel, styles.ceTextInput]}
          />
        </View>
        <LinearGradient
          colors={[colors.liner_light1, colors.liner_light2]}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0, 0.6]}
          style={styles.ceButton}>
          <Pressable onPress={handlePress}>
            <Text style={styles.ceButtonText}>{t('send_code')}</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
};

export default memo(Comfirm);

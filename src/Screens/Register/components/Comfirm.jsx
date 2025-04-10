import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import React, { memo } from 'react';
import colors from '../../../../assets/common/colorCss';
import { useTranslation } from 'react-i18next';

const Comfirm = ({email, handleSendCode, handleInputChange, handleEmail}) => {
  const {t} = useTranslation();
  const handlePress = () => {
    handleEmail();
    handleSendCode();
  };
  return (
    <View style={styles.container}>
      <View style={styles.formLogin}>
        <Image
          style={styles.img}
          source={require('../../../../assets/icon/ic_protect.png')}
        />
        <Text style={styles.txtTitle}>{t('otp_verification')}</Text>
        <Text style={styles.txtSub}>{t('otp_send_message')}</Text>
        <View style={styles.layoutInput}>
          <Text style={styles.txtform}>{t('confirm_email')}</Text>
          <TextInput
            value={email}
            onChangeText={text => handleInputChange('email', text)}
            placeholder={t('enter_email')}
            placeholderTextColor={colors.white}
            style={[styles.txtform, styles.txtEmail]}
          />
        </View>

        <Pressable onPress={handlePress} style={styles.button}>
  <Text style={styles.buttonText}>{t('send_code')}</Text>
</Pressable>
      </View>
    </View>
  );
};

export default memo(Comfirm);

const styles = StyleSheet.create({
  container: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 120,
    height: 120,
    // backgroundColor: colors.green,
  },
  formLogin: {
    width: '80%',
    // backgroundColor: colors.white,
    borderRadius: 39,
    alignItems: 'center',
    gap: 30,
  },
  txtTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  txtSub: {
    width: '70%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  layoutInput: {
    width: '90%',
    alignItems: 'center',
  },
  txtform: {
    color: colors.white,
    fontSize: 16,
  },
  txtEmail: {
    width: '100%',
    fontStyle: 'italic',
    fontWeight: '500',

    textDecorationStyle: 'solid',
    fontSize: 16,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: colors.loginBtn,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

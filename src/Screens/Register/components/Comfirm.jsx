import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from 'react-native';
import React from 'react';
import colors from '../../../../assets/common/colorCss';

const Comfirm = ({email, handleSendCode, handleInputChange}) => {
  return (
    <View style={styles.container}>
      <View style={styles.formLogin}>
        <Image style={styles.img} />
        <Text style={styles.txtTitle}>Xác minh OTP</Text>
        <Text style={styles.txtSub}>Chúng tôi sẽ gửi mã OTP đến cho bạn</Text>
        <View style={styles.layoutInput}>
          <Text style={styles.txtform}>Xác nhận email</Text>
          <TextInput
            value={email}
            onChangeText={text => handleInputChange('email', text)}
            placeholder={'Nhập Email'}
            style={[styles.txtform, styles.txtEmail]}
          />
        </View>

        <Pressable onPress={handleSendCode} style={styles.button}>
          <Text style={styles.buttonText}>Gửi mã</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Comfirm;

const styles = StyleSheet.create({
  container: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 100,
    height: 100,
    backgroundColor: colors.green,
  },
  formLogin: {
    width: '80%',
    height: '50%',
    // backgroundColor: colors.white,
    borderRadius: 39,
    alignItems: 'center',
    gap: 10,
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
    textAlign: 'center',
    textDecorationStyle: 'solid',
    fontSize: 18,
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

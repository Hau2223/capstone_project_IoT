import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Pressable,
} from 'react-native';
import React, {memo} from 'react';
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = () => {
  return (
    <LinearGradient
      colors={['#A7AEF9', '#DDCCF8', '#F5C9D9', '#CEBBFA', '#FAF1EE']}
      locations={[0.08, 0.32, 0.6, 0.86, 1]}
      style={styles.container}>
      <StatusBar barStyle={'light-content'} hidden={true} />
      <View style={styles.formLogin}>
        <View style={styles.login}>
          <Text style={styles.txtTitle}>Login</Text>
          <TextInput
            placeholder="Nhập Email"
            placeholderTextColor={'#AEAEAE'}
            style={{
              height: 40,
              width: '100%',
              backgroundColor: '#F5F5F5',
              borderRadius: 30,
              paddingHorizontal: 10,
            }}
          />
          <TextInput
            placeholder="Nhập mật khẩu"
            placeholderTextColor={'#AEAEAE'}
            style={{
              height: 40,
              width: '100%',
              backgroundColor: '#F5F5F5',
              borderRadius: 30,
              paddingHorizontal: 10,
            }}
          />
          <Text style={styles.txtForget}>Quên mật khẩu</Text>
        </View>
        <View style={styles.layoutbtn}>
          <Pressable style={styles.btnLogin}>
            <Text>Login</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

export default memo(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formLogin: {
    width: '80%',
    height: '50%',
    backgroundColor: '#fff',
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    height: '50%',
    width: '80%',
    backgroundColor: 'white',
    gap: 18,
  },
  txtTitle: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  txtForget: {
    fontStyle: 'italic',
    color: 'blue',
  },
  layoutbtn: {
    height: '30%',
    backgroundColor: 'green',
    width: '80%',
    alignItems: 'center',
  },
  btnLogin: {
    width: '80%',
    backgroundColor: '#8359E3',
  },
});

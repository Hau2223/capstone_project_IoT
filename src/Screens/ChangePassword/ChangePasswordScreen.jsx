import {Text, View, StatusBar, TouchableOpacity, Alert} from 'react-native';
import React, {memo, useContext, useState} from 'react';
import {createStyle} from './style';
import {useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import HeaderCompo from '../../components/HeaderCompo';
import colors from '../../../assets/common/colorCss';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {changePassword} from '../../../services/authServices';

const ChangePasswordScreen = ({navigation}) => {
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const {t} = useTranslation();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [secureEntry, setSecureEntry] = useState({
    current: true,
    new: true,
    confirm: true,
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  const toggleSecureEntry = field => {
    setSecureEntry(prev => ({...prev, [field]: !prev[field]}));
  };

  const handleChangePass = async () => {
    const {currentPassword, newPassword, confirmPassword} = formData;

    const newError = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    let hasError = false;
    // if(!currentPassword){
    //   newError.currentPassword = t('Current password is incorrect')
    // }
    if (!newPassword || newPassword.length < 8) {
      newError.newPassword = t('password_min_length');
      hasError = true;
    }

    if (newPassword !== confirmPassword) {
      newError.confirmPassword = t('passwords_do_not_match');
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    try {
      const res = await changePassword({currentPassword, newPassword});
      Alert.alert(t('success'), t('password_changed_successfully'), [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong';
      Alert.alert(t('error'), msg);
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.primary : colors.bg_dark}
          barStyle={theme === 'light' ? 'light-content' : 'light-content'}
        />
      )}
      <HeaderCompo
        name={t('change_password')}
        isPress={() => navigation.goBack()}
        bgcolor={theme === 'light' ? colors.primary : colors.bg_dark}
        color={colors.white}
      />
      <View style={styles.content}>
        {/* Mật khẩu hiện tại */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('current_password')}</Text>
          <TextInput
            placeholder={t('enter_current_password')}
            value={formData.currentPassword}
            onChangeText={value => handleChange('currentPassword', value)}
            secureTextEntry={secureEntry.current}
            right={
              <TextInput.Icon
                icon={secureEntry.current ? 'eye-off' : 'eye'}
                onPress={() => toggleSecureEntry('current')}
              />
            }
            style={styles.input}
            mode="outlined"
            activeOutlineColor={colors.primary}
            outlineColor={colors.black}
          />
          {error.currentPassword ? (
            <Text style={styles.errorText}>{error.currentPassword}</Text>
          ) : null}
        </View>

        {/* Mật khẩu mới */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('new_password')}</Text>
          <TextInput
            placeholder={t('enter_new_password')}
            value={formData.newPassword}
            onChangeText={value => handleChange('newPassword', value)}
            secureTextEntry={secureEntry.new}
            right={
              <TextInput.Icon
                icon={secureEntry.new ? 'eye-off' : 'eye'}
                onPress={() => toggleSecureEntry('new')}
              />
            }
            style={styles.input}
            mode="outlined"
            activeOutlineColor={colors.primary}
            outlineColor={colors.black}
          />
          {error.newPassword ? (
            <Text style={styles.errorText}>{error.newPassword}</Text>
          ) : null}
        </View>

        {/* Xác nhận mật khẩu */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('confirm_password')}</Text>
          <TextInput
            placeholder={t('reenter_new_password')}
            value={formData.confirmPassword}
            onChangeText={value => handleChange('confirmPassword', value)}
            secureTextEntry={secureEntry.confirm}
            right={
              <TextInput.Icon
                icon={secureEntry.confirm ? 'eye-off' : 'eye'}
                onPress={() => toggleSecureEntry('confirm')}
              />
            }
            style={styles.input}
            mode="outlined"
            activeOutlineColor={colors.primary}
            outlineColor={colors.black}
          />
          {error.confirmPassword ? (
            <Text style={styles.errorText}>{error.confirmPassword}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.btnSave} onPress={handleChangePass}>
          <Text style={styles.txtSave}>{t('save')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(ChangePasswordScreen);

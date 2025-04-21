import React, {memo, useState, useContext} from 'react';
import {
  View,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  Linking,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {TextInput, Text, Avatar} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {IMAGES} from '../../../utils/constants';
import {Picker} from '@react-native-picker/picker';
import {updateProfile, uploadAvatar} from '../../../services/authServices';
import {createStyle} from './style';
import {useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../../assets/common/themeProvider';
import colors from '../../../assets/common/colorCss';
import HeaderCompo from '../../components/HeaderCompo';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';

const EditProfileScreen = ({navigation, route}) => {
  const {userInfo} = route.params;
  const {theme} = useContext(ThemeContext);
  const {t} = useTranslation();
  const styles = createStyle(theme);
  const isFocused = useIsFocused();
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    gender: userInfo?.gender || '',
    address: userInfo?.address || '',
    dob: userInfo?.dob || '',
    avatar: userInfo?.avatar || null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      const sdkInt = Platform.Version;
      let permission;

      if (sdkInt >= 33) {
        permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      } else {
        permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      }

      const alreadyGranted = await PermissionsAndroid.check(permission);
      if (alreadyGranted) return true;

      const result = await PermissionsAndroid.request(permission, {
        title: 'Cho phép truy cập ảnh',
        message: 'Ứng dụng cần quyền để chọn ảnh từ thư viện',
        buttonNeutral: 'Hỏi lại sau',
        buttonNegative: 'Từ chối',
        buttonPositive: 'Đồng ý',
      });

      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert(
        'Quyền bị từ chối',
        'Vui lòng cấp quyền truy cập ảnh trong cài đặt thiết bị',
        [
          {text: 'Hủy'},
          {text: 'Mở cài đặt', onPress: () => Linking.openSettings()},
        ],
      );
      return;
    }

    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        handleChange('avatar', response.assets[0].uri);
      }
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Dữ liệu gửi đi:', formData);

      if (formData.avatar && !formData.avatar.startsWith('http')) {
        const form = new FormData();
        form.append('avatar', {
          uri: formData.avatar,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        });

        const uploadRes = await uploadAvatar(form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Upload avatar response:', uploadRes);
      }

      await updateProfile({
        name: formData?.name,
        phone: formData?.phone,
        gender: formData?.gender,
        address: formData?.address,
        dob: formData?.dob,
      });

      // console.log('Update profile response:', updateRes);

      Alert.alert('Thành công', 'Cập nhật hồ sơ thành công', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err) {
      console.error('Lỗi khi lưu thông tin:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Vẫn lưu dạng YYYY-MM-DD trong state để xử lý backend
      const formattedDate = format(selectedDate, 'dd/MM/yyyy');
      handleChange('dob', formattedDate);
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
      )}

      {/* Header luôn ở trên cùng */}
      <HeaderCompo
        name={t('editProfile')}
        isPress={() => navigation.goBack()}
        bgcolor={theme === 'light' ? colors.white : colors.bg_dark}
        color={theme === 'light' ? colors.bg_dark : colors.white}
      />

      {/* Nội dung chính nằm trong ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}>
        <View style={styles.avatarWrapper}>
          <Pressable style={styles.avatarContainer} onPress={pickImage}>
            <Image
              source={{
                uri: formData?.avatar || IMAGES.IMAGES_H,
              }}
              style={styles.avatar}
            />
            <Avatar.Icon icon="camera" size={30} style={styles.cameraIcon} />
          </Pressable>
        </View>

        <View style={styles.contentWrapper}>
          {/* Họ tên */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('name')}</Text>
            <TextInput
              placeholder={t('enter_name')}
              value={formData.name}
              onChangeText={value => handleChange('name', value)}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={colors.primary}
              outlineColor={colors.black}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('email')}</Text>
            <TextInput
              placeholder={t('enter_email')}
              editable={false}
              value={formData.email}
              onChangeText={value => handleChange('email', value)}
              keyboardType="email-address"
              style={styles.input}
              mode="outlined"
              activeOutlineColor={colors.primary}
              outlineColor={colors.black}
            />
          </View>

          {/* Số điện thoại */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('phone')}</Text>
            <TextInput
              placeholder={t('enter_phone')}
              value={formData.phone}
              onChangeText={value => handleChange('phone', value)}
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={colors.primary}
              outlineColor={colors.black}
              right={<TextInput.Affix text={`${formData?.phone.length}/10`} />}
            />
          </View>

          {/* Giới tính */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('gender')}</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={value => handleChange('gender', value)}
                style={styles.picker}
                dropdownIconColor={colors.black}>
                <Picker.Item label={t('male')} value="male" />
                <Picker.Item label={t('female')} value="female" />
                <Picker.Item label={t('other')} value="other" />
              </Picker>
            </View>
          </View>

          {/* Ngày sinh */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('dob')}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                pointerEvents="none"
                placeholder="Chọn ngày sinh"
                value={
                  formData.dob
                    ? format(new Date(formData.dob), 'dd/MM/yyyy')
                    : ''
                }
                editable={false}
                style={styles.input}
                mode="outlined"
                activeOutlineColor={colors.primary}
                right={
                  <TextInput.Icon
                    icon="calendar"
                    onPress={() => setShowDatePicker(true)}
                  />
                }
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.dob ? new Date(formData.dob) : new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={onChangeDate}
              />
            )}
          </View>

          {/* Địa chỉ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('address')}</Text>
            <TextInput
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChangeText={value => handleChange('address', value)}
              style={styles.input}
              mode="outlined"
              activeOutlineColor={colors.primary}
            />
          </View>
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.btnSave}>
          <Text style={styles.txtSave}>{t('save')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default memo(EditProfileScreen);

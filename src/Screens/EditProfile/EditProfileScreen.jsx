import React, {memo, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  Linking,
} from 'react-native';
import {TextInput, Button, Text, Avatar} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {IMAGES} from '../../../utils/constants';
import {Picker} from '@react-native-picker/picker';
import { uploadAvatar } from '../../../services/authServices';

const EditProfileScreen = ({navigation, route}) => {
  const {userInfo, onUpdate} = route.params;
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    gender: userInfo?.gender || '',
    address: userInfo?.address || '',
    avatar: userInfo?.avatar || null,
  });

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
      const form = new FormData();
  
      if (formData.avatar && !formData.avatar.startsWith('http')) {
        form.append('avatar', {
          uri: formData.avatar,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        });
      }
  
      const response = await uploadAvatar(form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      
      Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
      
      console.log('Kết quả upload:', response);
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      Alert.alert('Lỗi', 'Không thể upload ảnh. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <View  style={styles.avatarWrapper}>
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
      <View>
        <TextInput
          label="Họ tên"
          placeholder="Nhập tên của bạn"
          value={formData.name}
          onChangeText={value => handleChange('name', value)}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          placeholder="Nhập email"
          value={formData.email}
          onChangeText={value => handleChange('email', value)}
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          value={formData.phone}
          onChangeText={value => handleChange('phone', value)}
          keyboardType="number-pad"
          style={styles.input}
          mode="outlined"
          maxLength={10}
          right={<TextInput.Affix text={`${formData?.phone.length}/10`} />}
        />
        <Text style={{marginBottom: 5}}>Giới tính</Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            marginBottom: 15,
          }}>
          <Picker
            selectedValue={formData.gender}
            onValueChange={value => handleChange('gender', value)}>
            <Picker.Item label="Nam" value="male" />
            <Picker.Item label="Nữ" value="female" />
            <Picker.Item label="Khác" value="other" />
          </Picker>
        </View>

        <TextInput
          label="Địa chỉ"
          placeholder="Nhập địa chỉ của bạn"
          value={formData.address}
          onChangeText={value => handleChange('address', value)}
          style={styles.input}
          mode="outlined"
        />
      </View>
      <Pressable
        mode="contained"
        onPress={handleSave}
        style={{marginTop: 20, alignItems: 'center'}}>
        <Text>Lưu</Text>
      </Pressable>
    </View>
  );
};

export default memo(EditProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 15,
  },
});

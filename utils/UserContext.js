import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';

// Tạo Context
export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
  const navigation = useNavigation();
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true); // Đặt mặc định là true

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const onboarded = await AsyncStorage.getItem('onboarded');
        if (onboarded === '1') {
          if (token) {
            setUserToken(token);
            navigation.navigate('Tabs');
          } else {
            await AsyncStorage.removeItem('authToken');
            navigation.navigate('Login');
          }
        } else {
          navigation.navigate('OnBoarding');
        }
      } catch (err) {
        console.log('❌ Lỗi khi kiểm tra trạng thái đăng nhập:', err);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
    <UserContext.Provider value={{userToken, loading, setUserToken}}>
      {children}
    </UserContext.Provider>
  );
};
import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';

// Tạo Context
export const UserContext = createContext(null);

export const UserProvider = ({children}) => {
  const navigation = useNavigation();
  const [userToken, setUserToken] = useState(null);
  const [isOnboarded, setIsOnboarded] = useState(null);
  const [loading, setLoading] = useState(true); // Đặt mặc định là true

  const isTokenValid = token => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Hiển thị Loading trong 2 giây
        await new Promise(resolve => setTimeout(resolve, 1000));

        const token = await AsyncStorage.getItem('authToken');
        const onboarded = await AsyncStorage.getItem('onboarded');

        if (onboarded === '1') {
          if (token && isTokenValid(token)) {
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
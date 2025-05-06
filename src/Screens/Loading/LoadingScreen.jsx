import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Animated,
  SafeAreaView,
} from 'react-native';
import React, {memo, useEffect, useRef, useState, useContext} from 'react';
import colors from '../../../assets/common/colorCss';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext} from '../../../utils/UserContext'; // Import UserContext

const LoadingScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userToken, loading} = useContext(UserContext); // Lấy userToken và loading từ UserContext
  const progress = useRef(new Animated.Value(0)).current;
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const listenerId = progress.addListener(({value}) => {
      setPercentage(Math.floor(value * 100));
    });

    if (isFocused) {
      // Reset về 0 trước khi chạy lại
      progress.setValue(0);

      Animated.timing(progress, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start(() => {
        // Callback khi animation hoàn tất
        if (!loading) {
          checkNavigation();
        }
      });
    }

    return () => {
      progress.removeListener(listenerId);
    };
  }, [isFocused, progress, loading]);

  // Hàm kiểm tra và điều hướng
  const checkNavigation = async () => {
    try {
      const onboarded = await AsyncStorage.getItem('onboarded');
      if (onboarded === '1') {
        if (userToken) {
          navigation.navigate('Tabs');
        } else {
          navigation.navigate('Login');
        }
      } else {
        navigation.navigate('OnBoarding');
      }
    } catch (err) {
      console.log('❌ Lỗi khi kiểm tra trạng thái điều hướng:', err);
    }[]};

  // Điều hướng khi loading thay đổi
  useEffect(() => {
    if (!loading && percentage === 100) {
      checkNavigation();
    }
  }, [loading, percentage, navigation, userToken]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isFocused && (
          <StatusBar
            backgroundColor={colors.primary}
            barStyle={'light-content'}
          />
        )}
        <Image
          source={require('../../../assets/icon/ic_logo.png')}
          style={{height: 130, width: 130}}
          resizeMode="cover"
        />
        <View style={styles.progressBarContainer}>
          <Text style={styles.progressText}>{percentage}%</Text>
          <Animated.View style={[styles.progressBar, {width}]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    position: 'absolute',
    bottom: '5%',
    left: '10%',
    right: '10%',
    height: 20,
    backgroundColor: colors.bg_primary,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
    position: 'absolute',
    left: 0,
  },
  progressText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    zIndex: 1,
    textAlign: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export default memo(LoadingScreen);
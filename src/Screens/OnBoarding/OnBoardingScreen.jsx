import { View, StyleSheet, Pressable, Text } from 'react-native';
import React, { memo } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnBoardingScreen = () => {
  const navigation = useNavigation();

  const handleDone = () => {
    navigation.navigate('Login');
    AsyncStorage.setItem('onboarded', '1');
  };

  const btnDone = ({ ...props }) => {
    return (
      <Pressable style={styles.btnDone} {...props}>
        <Text style={styles.txtDone}>Done</Text>
      </Pressable>
    );
  };

  const handleDots = ({ selected }) => {
    return (
      <View
        style={[
          styles.dots_ctn,
          selected ? styles.selectedBorder : styles.selectedBorder2,
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            selected ? styles.bgRed400 : styles.bgRed200,
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        bottomBarHighlight={false}
        DoneButtonComponent={btnDone}
        DotComponent={handleDots}
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.animation}
                  source={require('../../../assets/animation/Animation1.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Tiện lợi và nhanh chóng',
            subtitle: 'Quản lý tất cả khu vườn trong một ứng dụng duy nhất',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.animation}
                  source={require('../../../assets/animation/Animation1.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Kiểm soát cây trồng',
            subtitle: 'Hiển thị nhiệt độ, độ ẩm, ánh sáng,...',
          },
          {
            backgroundColor: '#fff',
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.animation}
                  source={require('../../../assets/animation/Animation1.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: 'Cài đặt thời gian tưới',
            subtitle:
              'Thiết lập thời gian tưới chính xác cho từng khu vườn của bạn',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lottie: {
    width: 300,
    height: 350,
  },
  animation: {
    flex: 1,
  },
  btnDone: {
    padding: 20,
    backgroundColor: 'green',
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
  },
  txtDone: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Dots components for swiper
  dots_ctn: {
    width: 15,
    height: 15,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: '#f87171',
  },
  selectedBorder2: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },
  bgRed400: {
    backgroundColor: '#f87171',
  },
  bgRed200: {
    backgroundColor: '#fecaca',
  },
});

export default memo(OnBoardingScreen);

import {View, StyleSheet, Pressable, Text, StatusBar, BackHandler} from 'react-native';
import React, {memo, useEffect} from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../assets/common/colorCss';
import {useIsFocused} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const OnBoardingScreen = () => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const handleDone = () => {
    navigation.navigate('Loading');
    AsyncStorage.setItem('onboarded', '1');
  };

  // Thành phần nút Done
  const btnDone = ({...props}) => {
    return (
      <Pressable style={styles.btnDone} {...props}>
        <Text style={styles.txtDone}>{t('get_started')}</Text>
      </Pressable>
    );
  };

  // Thành phần nút Skip
  const btnSkip = ({...props}) => {
    return (
      <Pressable style={styles.btnSkip} {...props}>
        <Text style={styles.txtSkip}>{t('skip')}</Text>
      </Pressable>
    );
  };

  // Thành phần nút Next
  const btnNext = ({...props}) => {
    return (
      <Pressable style={styles.btnNext} {...props}>
        <Text style={styles.txtNext}>{t('next')}</Text>
      </Pressable>
    );
  };

  const handleDots = ({selected}) => {
    return (
      <View
        style={[
          styles.dots_ctn,
          selected ? styles.selectedBorder : styles.selectedBorder2,
        ]}>
        <View
          style={[
            styles.innerCircle,
            selected ? styles.bgRed400 : styles.bgRed200,
          ]}
        />
      </View>
    );
  };

  const shouldExitApp = React.useCallback(() => {
    const currentRoute =
      navigation.getState().routes[navigation.getState().index].name;
    return currentRoute === 'OnBoarding';
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      if (shouldExitApp()) {
        BackHandler.exitApp();
        return true;
      }
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => subscription.remove();
  }, [navigation, shouldExitApp]);

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      )}
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        bottomBarHighlight={false}
        DoneButtonComponent={btnDone}
        SkipButtonComponent={btnSkip}
        NextButtonComponent={btnNext}
        DotComponent={handleDots}
        pages={[
          {
            backgroundColor: colors.white,
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.animation}
                  source={require('../../../assets/animation/start.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: t('convenient_quick_title'),
            subtitle: t('convenient_quick_subtitle'),
            titleStyles: {
              fontWeight: 'bold',
              color: colors.primary,
            },
            subTitleStyles: {
              color: colors.primary,
            },
          },
          {
            backgroundColor: colors.white,
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.animation}
                  source={require('../../../assets/animation/tree.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: t('control_plants_title'),
            subtitle: t('control_plants_subtitle'),
            titleStyles: {
              fontWeight: 'bold',
              color: colors.primary,
            },
            subTitleStyles: {
              color: colors.primary,
            },
          },
          {
            backgroundColor: colors.white,
            image: (
              <View style={styles.lottie}>
                <LottieView
                  style={styles.animation}
                  source={require('../../../assets/animation/timer.json')}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: t('set_watering_time_title'),
            subtitle: t('set_watering_time_subtitle'),
            titleStyles: {
              fontWeight: 'bold',
              color: colors.primary,
            },
            subTitleStyles: {
              color: colors.primary,
            },
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
    backgroundColor: colors.primary,
  },
  txtDone: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  // Thêm style cho nút Skip
  btnSkip: {
    padding: 10,
  },
  txtSkip: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary, // Màu chữ cho Skip
  },
  // Thêm style cho nút Next
  btnNext: {
    padding: 10,
  },
  txtNext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary, // Màu chữ cho Next
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
    borderColor: colors.primary,
  },
  selectedBorder2: {
    borderWidth: 2,
    borderColor: colors.white,
  },
  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },
  bgRed400: {
    backgroundColor: colors.primary,
  },
  bgRed200: {
    backgroundColor: colors.bg_primary,
  },
});

export default memo(OnBoardingScreen);

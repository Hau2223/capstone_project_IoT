import {StyleSheet, View, StatusBar} from 'react-native';
import React, {memo, useContext} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTranslation} from 'react-i18next';
import ScheduleScreen from '../ScheduleScreen/ScheduleScreen';
import SensorThresholdScreen from '../SensorThreshold/SensorThresholdScreen';
import colors from '../../../assets/common/colorCss';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';

const TopTab = createMaterialTopTabNavigator();

const AreaScheduleScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const styles = createStyle(theme);
  const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar
          backgroundColor={theme === 'light' ? colors.white : colors.bg_dark}
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
      )}
      <TopTab.Navigator
        screenOptions={{
          tabBarActiveTintColor:colors.primary,
          tabBarInactiveTintColor:theme === 'light'? colors.bg_InActopTab : colors.white,
          tabBarIndicatorStyle:  {backgroundColor: colors.primary, height: 3},
          tabBarStyle: {
            backgroundColor: theme === 'light' ? colors.white : colors.bg_dark,
          },
          tabBarLabelStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            textTransform: 'none',
          },
        }}>
        <TopTab.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{tabBarLabel: t('watering_schedule')}}
          initialParams={{...route.params}}
        />
        <TopTab.Screen
          name="SensorThreshold"
          component={SensorThresholdScreen}
          options={{tabBarLabel: t('set_threshold')}}
          ư
          initialParams={{...route.params}}
        />
      </TopTab.Navigator>
    </View>
  );
};

export default memo(AreaScheduleScreen);



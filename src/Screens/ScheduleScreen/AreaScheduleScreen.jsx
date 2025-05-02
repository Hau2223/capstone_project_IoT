import {StyleSheet, View, StatusBar} from 'react-native';
import React, {useContext} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTranslation} from 'react-i18next';
import ScheduleScreen from './ScheduleScreen';
import SensorThresholdScreen from './SensorThresholdScreen';
import colors from '../../../assets/common/colorCss';
import {ThemeContext} from '../../../assets/common/themeProvider';
import {createStyle} from './style';

const TopTab = createMaterialTopTabNavigator();

const AreaScheduleScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  // const styles = createStyle(theme);
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
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
          },
          tabBarStyle: {
            backgroundColor: colors.white,
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
          options={{tabBarLabel: t('Lịch tưới')}}
          initialParams={{...route.params}}
        />
        <TopTab.Screen
          name="SensorThreshold"
          component={SensorThresholdScreen}
          options={{tabBarLabel: t('Cảm biến')}}
          ư
          initialParams={{...route.params}}
        />
      </TopTab.Navigator>
    </View>
  );
};

export default AreaScheduleScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
});

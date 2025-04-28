import { StyleSheet, View } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ManualControlScreen from './ManualControlScreen';
import ScheduleScreen from './ScheduleScreen';
import { useTranslation } from 'react-i18next';

const TopTab = createMaterialTopTabNavigator();

const AreaScheduleScreen = ({ navigation, route }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TopTab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: {
            backgroundColor: '#4CAF50',
          },
          tabBarStyle: {
            backgroundColor: '#EAEAEA',
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'none',
          },
        }}
      >
        <TopTab.Screen
          name="ScheduleScreen"
          component={ScheduleScreen}
          options={{ tabBarLabel: t('Lịch tưới') }}
          initialParams={{ ...route.params }}
        />
        <TopTab.Screen
          name="ManualControl"
          component={ManualControlScreen}
          options={{ tabBarLabel: t('Cảm biến') }}ư
          initialParams={{ ...route.params }}
        />
      </TopTab.Navigator>
    </View>
  );
};

export default AreaScheduleScreen ;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
});
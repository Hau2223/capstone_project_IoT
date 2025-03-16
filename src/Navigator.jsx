import {Button, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {UserProvider, UserContext} from '../utils/UserContext';
import OnBoardingScreen from './Screens/OnBoarding/OnBoardingScreen';
import LoginScreen from './Screens/LoginScreen/LoginScreen';
import RegisterScreen from './Screens/Register/RegisterScreen';

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

const HomeScreen = ({navigation}) => (

  <View style={styles.container}>
    <Text style={styles.text}>Home Screen</Text>
    <Button
      title="Go to Details"
      onPress={() => navigation.navigate('Details')}
    />
  </View>
);

const DetailsScreen = ({ navigation }) => {
  const handleGoBack = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Details Screen</Text>
      <Button title="Go back" onPress={handleGoBack} />
    </View>
  );
};

const SettingScreen = ({navigation}) => (
  <View style={styles.container}>
    <Text style={styles.text}>Setting Screen</Text>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

const LoadingScreen = ({navigation}) => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" color="tomato" />
  </View>
);

// Hàm lấy icon
const getTabBarIcon = (name, color) => {
  const icons = {
    Home: 'home-outline',
    Detail: 'information-circle-outline',
    Setting: 'settings-outline',
  };
  return (
    <Ionicons name={icons[name] || 'help-outline'} size={24} color={color} />
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFF',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: '#000',
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => getTabBarIcon('Home', color),
        }}
      />
      <Tab.Screen
        name="Detail"
        component={DetailsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => getTabBarIcon('Detail', color),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => getTabBarIcon('Setting', color),
        }}
      />
    </Tab.Navigator>
  );
}
const Navigator = () => {
  return (
    <NavigationContainer>
      <UserProvider>
        <StackNav.Navigator
          initialRouteName="Loading"
          screenOptions={{
            headerShown: false,
          }}>
          <StackNav.Screen
            name="Loading"
            component={LoadingScreen}
            options={{headerShown: false, animation: 'fade_from_bottom'}}
          />
          <StackNav.Screen
            name="OnBoarding"
            component={OnBoardingScreen}
            options={{headerShown: false, animation: 'fade_from_bottom'}}
          />
          <StackNav.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false, animation: 'fade_from_bottom'}}
          />
          <StackNav.Screen
            name="Register"
            component={RegisterScreen}
            options={{animation: 'fade'}}
          />
          <StackNav.Screen
            name="Tabs"
            component={MyTabs}
            options={{headerShown: false, animation: 'fade_from_bottom'}}
          />
        </StackNav.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

export default Navigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
  },
  text: {fontSize: 24, fontWeight: 'bold'},
});

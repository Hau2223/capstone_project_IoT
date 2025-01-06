import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginScreen from './Screens/LoginScreen/LoginScreen';

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
};

const DetailsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Details Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const SettingScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

// Hàm để lấy icon dựa trên tên tab
const getTabBarIcon = (name, color) => {
  let iconName;
  switch (name) {
    case 'Home':
      iconName = 'home-outline';
      break;
    case 'Detail':
      iconName = 'information-circle-outline';
      break;
    case 'Setting':
      iconName = 'settings-outline';
      break;
    default:
      iconName = 'help-outline';
  }

  return <Ionicons name={iconName} size={24} color={color} />;
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
      <StackNav.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <StackNav.Screen
          name="Tabs"
          component={MyTabs}
          options={{headerShown: false, animation: 'fade_from_bottom'}}
        />
        <StackNav.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false, animation: 'fade_from_bottom'}}
        />
      </StackNav.Navigator>
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

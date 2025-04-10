import {
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {UserProvider} from '../utils/UserContext';
import {ThemeProvider} from '../assets/common/themeProvider';
import {LanguageProvider} from '../assets/common/translation';
import {useTranslation} from 'react-i18next';

import {
  OnBoardingScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  HomeScreen,
  DetailScreen,
  SettingScreen,
  AccountInfoScreen,
  ChangePasswordScreen,
  GeneralSettingScreen,
  LanguageSettingScreen,
} from './Screens';

import ScheduleScreen from './Screens/ScheduleScreen/ScheduleScreen';
import DevicesListScreen from './Screens/ScheduleScreen/DevicesListScreen';
import AlarmScreen from './Screens/ScheduleScreen/AlarmScreen';
import SetTimerScreen from './Screens/ScheduleScreen/SetTimerScreen';
import ReportScreen from './Screens/ReportScreen/ReportScreen';
import ReportDetail from './Screens/ReportScreen/ReportDetail';
import colors from '../assets/common/colorCss';

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

const DetailsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Button title="Go back" />
    </View>
  );
};

const LoadingScreen = ({navigation}) => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" color="tomato" />
  </View>
);

// Hàm lấy icon
const getTabBarIcon = (name, color) => {
  const icons = {
    Home: require('../assets/icon/ic_home.png'),
    Statics: require('../assets/icon/ic_statics.png'),
    Reports: require('../assets/icon/ic_reports.png'),
    Setting: require('../assets/icon/ic_setting.png'),
  };
  return (
    <Image
      source={icons[name] || require('../assets/icon/ic_home.png')}
      style={{
        width: 25,
        height: 25,
        tintColor: color ? colors.acticetab : colors.inacticetab,
      }}
      resizeMode="contain"
    />
  );
};

function MyTabs() {
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFF',
          height: 55,
          borderTopWidth: 0,
          elevation: 0,
        },
        // tabBarItemStyle: {
        //   alignItems: 'center',
        //   justifyContent: 'center',
        //   backgroundColor: 'red',
        // },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.acticetab,
        tabBarInactiveTintColor: colors.inacticetab,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 14,
          // textAlign: 'center',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('home'),
          tabBarIcon: ({focused}) => getTabBarIcon('Home', focused),
        }}
      />
      <Tab.Screen
        name="ScheduleScreen"
        component={ScheduleScreen}
        options={{
          headerShown: false,
          // tabBarBadge: 48,
          tabBarLabel: t('history'),
          tabBarIcon: ({focused}) => getTabBarIcon('Statics', focused),
        }}
      />
      <Tab.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('statistical'),
          tabBarIcon: ({focused}) => getTabBarIcon('Reports', focused),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('setting'),
          tabBarIcon: ({focused}) => getTabBarIcon('Setting', focused),
        }}
      />
    </Tab.Navigator>
  );
}
const Navigator = () => {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <LanguageProvider>
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
                options={{headerShown: false, animation: 'fade'}}
              />
              <StackNav.Screen
                name="ResetPass"
                component={ResetPasswordScreen}
                options={{animation: 'fade'}}
              />
              <StackNav.Screen
                name="Tabs"
                component={MyTabs}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              {/* <StackNav.Screen
                name="Test"
                component={TestScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              /> */}
              <StackNav.Screen
                name="DetailScreen"
                component={DetailScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />

              <StackNav.Screen
                name="ScheduleScreen"
                component={ScheduleScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              <StackNav.Screen
                name="DevicesListScreen"
                component={DevicesListScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              <StackNav.Screen
                name="AlarmScreen"
                component={AlarmScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              <StackNav.Screen
                name="SetTimerScreen"
                component={SetTimerScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              <StackNav.Screen
                name="ReportDetail"
                component={ReportDetail}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              <StackNav.Screen
                name="AccountInfo"
                component={AccountInfoScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              <StackNav.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              <StackNav.Screen
                name="GeneralSetting"
                component={AccountInfoScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
              <StackNav.Screen
                name="LanguageSetting"
                component={LanguageSettingScreen}
                options={{headerShown: false, animation: 'fade_from_bottom'}}
              />
            </StackNav.Navigator>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default Navigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {fontSize: 24, fontWeight: 'bold'},
});

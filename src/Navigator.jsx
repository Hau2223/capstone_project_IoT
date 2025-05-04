import {
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {memo, useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {UserContext, UserProvider} from '../utils/UserContext';
import {ThemeContext, ThemeProvider} from '../assets/common/themeProvider';
import {LanguageProvider} from '../assets/common/translation';
import {useTranslation} from 'react-i18next';
import {PaperProvider} from 'react-native-paper';

import {
  LoadingScreen,
  OnBoardingScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  HomeScreen,
  DetailScreen,
  SettingScreen,
  AccountInfoScreen,
  EditProfileScreen,
  ChangePasswordScreen,
  GeneralSettingScreen,
  LanguageSettingScreen,
  SetTimerScreen,
  DevicesListScreen,
  AlarmScreen,
  AreaScheduleScreen,
} from './Screens';
import ReportScreen from './Screens/ReportScreen/ReportScreen';
import ReportDetail from './Screens/ReportScreen/components/ReportDetail';
import colors from '../assets/common/colorCss';

const Tab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

// Hàm lấy icon
const getTabBarIcon = (name, focused, theme) => {
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
        tintColor: focused
          ? colors.acticetab
          : theme === 'dark'
          ? colors.inacticetabDark
          : colors.inacticetab,
      }}
      resizeMode="contain"
    />
  );
};

function MyTabs() {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? colors.bg_dark : colors.white,
          height: 55,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarPressColor: 'transparent',
        tabBarPressOpacity: 1,
        tabBarItemStyle: {
          pressEffect: 'none', // Tắt hiệu ứng nhấp
        },
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.acticetab,
        tabBarInactiveTintColor:
          theme === 'dark' ? colors.inacticetabDark : colors.inacticetab,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('home'),
          tabBarIcon: ({focused}) => getTabBarIcon('Home', focused, theme),
        }}
      />
      <Tab.Screen
        name="AreaScheduleScreen"
        component={AreaScheduleScreen}
        options={{
          headerShown: false,
          // tabBarBadge: 48,
          tabBarLabel: t('wateringSchedule'),
          tabBarIcon: ({focused}) => getTabBarIcon('Statics', focused, theme),
        }}
      />
      <Tab.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('statistical'),
          tabBarIcon: ({focused}) => getTabBarIcon('Reports', focused, theme),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarLabel: t('setting'),
          tabBarIcon: ({focused}) => getTabBarIcon('Setting', focused, theme),
        }}
      />
    </Tab.Navigator>
  );
}
const Navigator = () => {
  return (
    <PaperProvider>
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
                  options={{headerShown: false, animation: 'fade'}}
                />
                <StackNav.Screen
                  name="OnBoarding"
                  component={OnBoardingScreen}
                  options={{headerShown: false, animation: 'fade'}}
                />
                <StackNav.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{headerShown: false, animation: 'fade'}}
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
                  options={{headerShown: false, animation: 'slide_from_right'}}
                />
                <StackNav.Screen
                  name="DetailScreen"
                  component={DetailScreen}
                  options={{headerShown: false, animation: 'fade'}}
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
                  options={{headerShown: false, animation: 'fade'}}
                />
                <StackNav.Screen
                  name="ChangePassword"
                  component={ChangePasswordScreen}
                  options={{headerShown: false, animation: 'slide_from_right'}}
                />
                <StackNav.Screen
                  name="GeneralSetting"
                  component={GeneralSettingScreen}
                  options={{headerShown: false, animation: 'slide_from_right'}}
                />
                <StackNav.Screen
                  name="LanguageSetting"
                  component={LanguageSettingScreen}
                  options={{headerShown: false, animation: 'slide_from_right'}}
                />
                <StackNav.Screen
                  name="EditProfile"
                  component={EditProfileScreen}
                  options={{headerShown: false, animation: 'slide_from_right'}}
                />
              </StackNav.Navigator>
            </UserProvider>
          </LanguageProvider>
        </ThemeProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default memo(Navigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {fontSize: 24, fontWeight: 'bold'},
});

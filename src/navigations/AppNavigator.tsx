// src/navigation/AppNavigator.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SCREENS} from './utils';
import {Colors} from '../configs/Colors';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/SettingsScreen';
import DebitCardScreen from '../screens/debit/DebitCardScreen';
import PaymentsScreen from '../screens/payments/PaymentsScreen';
import CreditScreen from '../screens/credit/CreditScreen';
import SVGIcons from '../components/SVGIcons';
import {moderateScale} from '../configs/ScalingSize';
import SpendingLimit from '../screens/spendingLimit/SpendingLimit';
import VoiceToText from '../screens/voice/VoiceToText';
import {Fonts} from '../configs/Fonts';

export type RootStackParamList = {
  [SCREENS.home]: undefined; // No params,
  [SCREENS.spendingLimit]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.greyLight,
      tabBarStyle: {
        height: 100,
      },
      tabBarLabelStyle: {
        fontSize: moderateScale(12),
        fontWeight: '600',
      },
    }}>
    {/* <Tab.Screen
      options={{
        tabBarIcon: ({focused}) => (
          <SVGIcons iconName="AspireHome" focused={focused} />
        ),
      }}
      name={SCREENS.home}
      component={HomeScreen}
    /> */}
    <Tab.Screen
      options={{
        tabBarIcon: ({focused}) => (
          <SVGIcons iconName="Voice" focused={focused} width={40} height={40} />
        ),
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        },
        tabBarLabelStyle: {
          padding: 5,
          fontFamily: Fonts.fontSemiBold,
          fontSize: 14,
        },
        tabBarLabel: 'Speech',
      }}
      name={SCREENS.voiceToText}
      component={VoiceToText}
    />

    {/* <Tab.Screen
      options={{
        tabBarIcon: ({focused}) => (
          <SVGIcons iconName="UserIcon" focused={focused} />
        ),
      }}
      name={SCREENS.profile}
      component={ProfileScreen}
    /> */}
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* <Stack.Screen name="Main" component={TabNavigator} /> */}
      <Stack.Screen name={SCREENS.voiceToText} component={VoiceToText} />
      {/* Add other screens as needed */}
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Text} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import {MainTabParamList} from './types';

import {colors} from '../theme/colors';
import {moderateScale} from 'react-native-size-matters';

const homeIcon = require('../assets/icons/home.png');
const historyIcon = require('../assets/icons/history.png');
const personIcon = require('../assets/icons/person.png');

const Tab = createBottomTabNavigator<MainTabParamList>();

const HistoryScreen = () => <Text>History Screen</Text>;
const ProfileScreen = () => <Text>Profile Screen</Text>;

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={homeIcon}
              resizeMode="contain"
              style={{
                width: moderateScale(22),
                height: moderateScale(22),
                tintColor: color,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={historyIcon}
              resizeMode="contain"
              style={{
                width: moderateScale(22),
                height: moderateScale(22),
                tintColor: color,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={personIcon}
              resizeMode="contain"
              style={{
                width: moderateScale(22),
                height: moderateScale(22),
                tintColor: color,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
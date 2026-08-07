import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { MainTabParamList } from './types';
import { colors } from '../theme/colors';

const homeIcon = require('../assets/icons/home.png');
const historyIcon = require('../assets/icons/history.png');
const personIcon = require('../assets/icons/person.png');

const Tab = createBottomTabNavigator<MainTabParamList>();

// Temporary placeholder until HistoryScreen is implemented
const HistoryScreen = () => <Text>History Screen — coming soon</Text>;

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          // Optional: Add some styling for better appearance
          height: moderateScale(60),
          paddingBottom: moderateScale(5),
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(12),
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
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
          tabBarIcon: ({ color }) => (
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
          tabBarIcon: ({ color }) => (
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
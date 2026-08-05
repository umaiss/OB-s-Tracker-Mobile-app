import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import ActiveTaskScreen from '../screens/ActiveTaskScreen';
import TaskCompletedScreen from '../screens/TaskCompletedScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
        />

        <Stack.Screen
          name="ActiveTask"
          component={ActiveTaskScreen}
          options={{
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="TaskCompleted"
          component={TaskCompletedScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
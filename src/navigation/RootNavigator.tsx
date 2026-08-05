import React from 'react';
<<<<<<< HEAD
import { NavigationContainer } from '@react-navigation/native';
=======
import { View, Text } from 'react-native';
>>>>>>> aa00fd6b9e7d72ac4c28b6d1e28b6262640981df
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import ActiveTaskScreen from '../screens/ActiveTaskScreen';
import TaskCompletedScreen from '../screens/TaskCompletedScreen';

import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

<<<<<<< HEAD
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
=======
const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
>>>>>>> aa00fd6b9e7d72ac4c28b6d1e28b6262640981df
  );
};

export default RootNavigator;
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import RootNavigator from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TaskProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </TaskProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
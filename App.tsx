import React, {useEffect} from 'react';
import LoginScreen from './src/screens/LoginScreen';
import BootSplash from 'react-native-bootsplash';

function App(): React.JSX.Element {

  useEffect(() => {
    BootSplash.hide({fade: true});
  }, []);

  return <LoginScreen />;
}

export default App;
import React, { useState } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import InputField from './InputField';
import { moderateScale } from 'react-native-size-matters';

const lockIcon = require('../assets/icons/lock.png');
const eyeIcon = require('../assets/icons/eye.png');
const eyeOffIcon = require('../assets/icons/eye-off.png');

type PasswordInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

const PasswordInput = ({ value, onChangeText }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputField
      label="Password"
      leftIcon={lockIcon}
      placeholder="Enter Password"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!isVisible}
      rightAccessory={
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <Image
            source={isVisible ? eyeIcon : eyeOffIcon}
            style={{ width: moderateScale(20), height: moderateScale(20) }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      }
    />
  );
};

export default PasswordInput;
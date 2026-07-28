import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import InputField from './InputField';
import { colors } from '../theme/colors';

type PasswordInputProps = {
  value: string;
  onChangeText: (text: string) => void;
};

const PasswordInput = ({ value, onChangeText }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputField
      label="Password"
      leftIcon="🔒"
      placeholder="Enter Password"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!isVisible}
      rightAccessory={
        <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
          <Text style={{ fontSize: 18, color: colors.secondary }}>
            {isVisible ? '👁️' : '🙈'}
          </Text>
        </TouchableOpacity>
      }
    />
  );
};

export default PasswordInput;
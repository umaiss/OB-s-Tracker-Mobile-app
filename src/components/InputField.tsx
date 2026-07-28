import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { verticalScale } from 'react-native-size-matters';

type InputFieldProps = TextInputProps & {
  label: string;
  leftIcon?: string;
  rightAccessory?: React.ReactNode;
};

const InputField = ({
  label,
  leftIcon,
  rightAccessory,
  ...textInputProps
}: InputFieldProps) => {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {leftIcon ? <Text style={styles.leftIcon}>{leftIcon}</Text> : null}
        <TextInput
          style={[
            styles.input,
            { paddingLeft: leftIcon ? 44 : spacing.md },
            { paddingRight: rightAccessory ? 44 : spacing.md },
          ]}
          placeholderTextColor={colors.secondaryFixedDim}
          {...textInputProps}
        />
        {rightAccessory ? (
          <View style={styles.rightAccessory}>{rightAccessory}</View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.labelCaps,
    color: colors.secondary,
    marginBottom: spacing.base,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    height: verticalScale(52),
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  leftIcon: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
    fontSize: 18,
  },
  rightAccessory: {
    position: 'absolute',
    right: spacing.md,
  },
});

export default InputField;
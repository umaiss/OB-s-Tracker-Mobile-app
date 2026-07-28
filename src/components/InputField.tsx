import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale, verticalScale } from 'react-native-size-matters';

type InputFieldProps = TextInputProps & {
  label: string;
  leftIcon?: ImageSourcePropType;
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
        {leftIcon ? (
          <Image source={leftIcon} style={styles.leftIcon} resizeMode="contain" />
        ) : null}
        <TextInput
          style={[
            styles.input,
            { paddingLeft: leftIcon ? moderateScale(44) : spacing.md },
            { paddingRight: rightAccessory ? moderateScale(44) : spacing.md },
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
    width: moderateScale(20),
    height: moderateScale(20),
  },
  rightAccessory: {
    position: 'absolute',
    right: spacing.md,
  },
});

export default InputField;
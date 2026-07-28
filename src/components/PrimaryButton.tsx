import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { verticalScale } from 'react-native-size-matters';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
};

const PrimaryButton = ({ label, onPress, loading }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: verticalScale(56),
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1.5,
  },
});

export default PrimaryButton;
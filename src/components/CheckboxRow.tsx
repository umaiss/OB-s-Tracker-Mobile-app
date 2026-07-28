import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale } from 'react-native-size-matters';


type CheckboxRowProps = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

const CheckboxRow = ({ checked, onToggle, label }: CheckboxRowProps) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  box: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.onPrimary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  label: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
  },
});

export default CheckboxRow;
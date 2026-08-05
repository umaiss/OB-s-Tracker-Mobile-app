import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale } from 'react-native-size-matters';

const chevronIcon = require('../assets/icons/chevron-right.png');

type SettingsRowProps = {
  icon: ImageSourcePropType;
  label: string;
  value: string;
  onPress?: () => void;
  isLast?: boolean;
};

const SettingsRow = ({ icon, label, value, onPress, isLast }: SettingsRowProps) => {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.value}>{value}</Text>
        <Image source={chevronIcon} style={styles.chevron} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor: colors.secondary,
  },
  label: {
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  value: {
    ...typography.bodySm,
    color: colors.secondary,
  },
  chevron: {
    width: moderateScale(16),
    height: moderateScale(16),
    tintColor: colors.outline,
  },
});

export default SettingsRow;
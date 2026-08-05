import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale, verticalScale } from 'react-native-size-matters';

type KpiCardProps = {
  icon: ImageSourcePropType;
  label: string;
  value: string;
};

const KpiCard = ({ icon, label, value }: KpiCardProps) => {
  return (
    <View style={styles.card}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(96),
    paddingVertical: spacing.xs,
  },
  icon: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor: colors.primary,
    marginBottom: spacing.base,
  },
  label: {
    ...typography.labelCaps,
    color: colors.secondary,
    marginBottom: spacing.base,
  },
  value: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
});

export default KpiCard;
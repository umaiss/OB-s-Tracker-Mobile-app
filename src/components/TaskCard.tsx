import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale } from 'react-native-size-matters';

const chevronIcon = require('../assets/icons/chevron-right.png');

type TaskCardProps = {
  icon: ImageSourcePropType;
  title: string;
  timeRange: string;
  status: string;
};

const TaskCard = ({ icon, title, timeRange, status }: TaskCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.time}>{timeRange}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Image source={chevronIcon} style={styles.chevron} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrapper: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: moderateScale(22),
    height: moderateScale(22),
    tintColor: colors.primary,
  },
  title: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  time: {
    ...typography.bodySm,
    color: colors.secondary,
  },
  right: {
    alignItems: 'flex-end',
    gap: moderateScale(6),
  },
  statusPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    color: '#15803d',
    textTransform: 'uppercase',
  },
  chevron: {
    width: moderateScale(16),
    height: moderateScale(16),
    opacity: 0.3,
  },
});

export default TaskCard;
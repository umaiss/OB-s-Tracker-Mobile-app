import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale } from 'react-native-size-matters';

const scheduleIcon = require('../assets/icons/schedule.png');
const routeIcon = require('../assets/icons/walk.png');

export type TaskStatus = 'completed' | 'pending_sync' | 'cancelled';

type HistoryTaskCardProps = {
  title: string;
  status: TaskStatus;
  timeRange?: string;
  startTime?: string;
  durationDistance?: string;
};

type StatusConfig = { stripeColor: string; badgeBg: string; badgeText: string; label: string };

const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
    completed: {
    stripeColor: '#2E7D32',
    badgeBg: '#dcfce7',
    badgeText: '#2E7D32',
    label: 'Completed',
  },
  pending_sync: {
    stripeColor: '#EF6C00',
    badgeBg: '#ffedd5',
    badgeText: '#EF6C00',
    label: 'Needs Submission',
  },
  cancelled: {
    stripeColor: '#D32F2F',
    badgeBg: '#fee2e2',
    badgeText: '#D32F2F',
    label: 'Cancelled',
  },
};

const HistoryTaskCard = ({
  title,
  status,
  timeRange,
  startTime,
  durationDistance,
}: HistoryTaskCardProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <View style={[styles.stripe, { backgroundColor: config.stripeColor }]} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{title}</Text>
            {status === 'pending_sync' && (
              <Text style={styles.retryText}>Settlement not submitted yet</Text>
            )}
          </View>
          <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
            <Text style={[styles.badgeText, { color: config.badgeText }]}>
              {config.label}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Image source={scheduleIcon} style={styles.infoIcon} resizeMode="contain" />
          <Text style={styles.infoText}>{timeRange ?? startTime}</Text>
        </View>

        {durationDistance && (
          <View style={styles.infoRow}>
            <Image source={routeIcon} style={styles.infoIcon} resizeMode="contain" />
            <Text style={styles.infoText}>{durationDistance}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  stripe: {
    width: moderateScale(6),
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  titleBlock: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  retryText: {
    ...typography.bodySm,
    color: '#EF6C00',
    fontWeight: '600',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: radius.lg,
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  infoIcon: {
    width: moderateScale(16),
    height: moderateScale(16),
    tintColor: colors.secondary,
  },
  infoText: {
    ...typography.bodySm,
    color: colors.secondary,
  },
});

export default HistoryTaskCard;
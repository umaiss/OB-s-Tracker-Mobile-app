import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale } from 'react-native-size-matters';
import StatusBadge from './StatusBadge';
import CircularTimer from './CircularTimer';


const chevronIcon = require('../assets/icons/chevron-right.png');

// Props for List View (existing)
type ListViewProps = {
  icon: ImageSourcePropType;
  title: string;
  timeRange: string;
  status: string;
};

// Props for Active Task View (new)
type ActiveTaskViewProps = {
  variant: 'active';
  status: string;
  gpsStatus: string;
  elapsedTime: string;
  taskTitle: string;
  trackingMessage: string;
  progress?: number;
  employeeName?: string;
  designation?: string;
  avatar?: any;
};

// Combined Props
type TaskCardProps = ListViewProps | ActiveTaskViewProps;

const TaskCard = (props: TaskCardProps) => {
  // Check if it's the active variant
  const isActiveVariant = 'variant' in props && props.variant === 'active';

  // Render Active Task Card (New Design)
  if (isActiveVariant) {
    const {
      status,
      gpsStatus,
      elapsedTime,
      taskTitle,
      trackingMessage,
      progress = 72,
      employeeName,
      designation,
      avatar,
    } = props as ActiveTaskViewProps;

    return (
      <View style={styles.activeCard}>
        {/* Header with employee info (optional) */}
        {employeeName && (
          <View style={styles.activeHeader}>
            <View>
              <Text style={styles.activeName}>{employeeName}</Text>
              {designation && (
                <Text style={styles.activeDesignation}>{designation}</Text>
              )}
            </View>
            {avatar && (
              <View style={styles.activeAvatar}>
                {typeof avatar === 'string' ? (
                  <Image source={{ uri: avatar }} style={styles.activeAvatarImage} />
                ) : (
                  <Image source={avatar} style={styles.activeAvatarImage} />
                )}
              </View>
            )}
          </View>
        )}

        {/* Badges Row */}
        <View style={styles.activeBadgesContainer}>
          <StatusBadge label={status} type="active" />
          <StatusBadge label={gpsStatus} type="gps" />
        </View>

        {/* Circular Timer */}
        <CircularTimer elapsedTime={elapsedTime} progress={progress} />

        {/* Task Details */}
        <View style={styles.activeDetailsContainer}>
          <Text style={styles.activeTaskTitle}>{taskTitle}</Text>
          <View style={styles.activeTrackingContainer}>
            <View style={styles.activeTrackingDot} />
            <Text style={styles.activeTrackingMessage}>{trackingMessage}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Render List View Task Card (Existing Design)
  const { icon, title, timeRange, status } = props as ListViewProps;
  
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
  // ========== EXISTING LIST VIEW STYLES ==========
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

  // ========== NEW ACTIVE TASK VIEW STYLES ==========
  activeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  activeDesignation: {
    fontSize: 14,
    color: '#999999',
    marginTop: 2,
  },
  activeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  activeAvatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  activeBadgesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  activeDetailsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  activeTaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  activeTrackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTrackingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  activeTrackingMessage: {
    fontSize: 14,
    color: '#666666',
  },
});

export default TaskCard;
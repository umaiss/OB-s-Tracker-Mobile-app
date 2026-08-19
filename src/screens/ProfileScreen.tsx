import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import KpiCard from '../components/KpiCard';
import SettingsRow from '../components/SettingsRow';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale } from 'react-native-size-matters';
import { useAuth } from '../context/AuthContext';
import { getTaskStats, TaskStats } from '../api/tasksApi';

const bellIcon = require('../assets/icons/bell.png');
const avatarIcon = require('../assets/icons/avatar-placeholder.png');
const taskIcon = require('../assets/icons/task.png');
const walkIcon = require('../assets/icons/walk.png');
const timerIcon = require('../assets/icons/timer.png');
const languageIcon = require('../assets/icons/language.png');
const infoIcon = require('../assets/icons/info.png');
const logoutIcon = require('../assets/icons/logout.png');

function formatKpiDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function formatKpiDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [_voiceInputEnabled, _setVoiceInputEnabled] = useState(true);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setStatsLoading(true);
      getTaskStats()
        .then(res => {
          if (!cancelled) setStats(res);
        })
        .catch(err => {
          console.warn('Failed to load task stats:', err.message);
        })
        .finally(() => {
          if (!cancelled) setStatsLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Profile</Text>
          <TouchableOpacity>
            <Image source={bellIcon} style={styles.bellIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <Image source={avatarIcon} style={styles.avatar} resizeMode="cover" />
            </View>
            <Text style={styles.name}>{user?.name ?? 'Employee'}</Text>
            <Text style={styles.role}>
              {user?.role === 'OFFICE_BOY' ? 'Office Boy' : user?.role}
            </Text>
            <View style={styles.empIdPill}>
              <Text style={styles.empIdText}>{user?.id?.slice(0, 8).toUpperCase() ?? 'N/A'}</Text>
            </View>
          </View>

          {/* Statistics */}
          <View>
            <Text style={styles.sectionLabel}>MY STATISTICS</Text>
            <View style={styles.statsRow}>
              <KpiCard
                icon={taskIcon}
                label="Total Tasks"
                value={statsLoading ? '…' : String(stats?.tasks.total ?? 0)}
              />
              <KpiCard
                icon={walkIcon}
                label="Distance"
                value={statsLoading ? '…' : formatKpiDistance(stats?.totalDistanceMeters ?? 0)}
              />
              <KpiCard
                icon={timerIcon}
                label="Total Time"
                value={statsLoading ? '…' : formatKpiDuration(stats?.totalDurationSeconds ?? 0)}
              />
            </View>
          </View>

          {/* Settings */}
          <View>
            <Text style={styles.sectionLabel}>SETTINGS</Text>
            <View style={styles.settingsCard}>
              <SettingsRow icon={languageIcon} label="Language" value="English" />
              <SettingsRow icon={bellIcon} label="Notifications" value="Enabled" />
              <SettingsRow icon={infoIcon} label="About App" value="v1.0.0" isLast />
            </View>
          </View>

          {/* Log Out */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Image source={logoutIcon} style={styles.logoutIcon} resizeMode="contain" />
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.md,
  },
  topBarTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: 'bold',
  },
  bellIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
    tintColor: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: radius.full,
    borderWidth: 4,
    borderColor: colors.surfaceContainerLowest,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.base,
  },
  role: {
    ...typography.bodyLg,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  empIdPill: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.base,
    borderRadius: radius.full,
  },
  empIdText: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
  },
  sectionLabel: {
    ...typography.labelCaps,
    color: colors.secondary,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  settingsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: moderateScale(56),
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.xl,
  },
  logoutIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor: colors.onPrimary,
  },
  logoutText: {
    ...typography.headlineMd,
    color: colors.onPrimary,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

import React, {useState, useEffect, useCallback} from 'react';

import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { getCurrentLocation } from '../location/locationTracker';
import { getEmployees, getTaskStats, Employee, TaskStats } from '../api/tasksApi';

import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import KpiCard from '../components/KpiCard';
import CheckboxRow from '../components/CheckboxRow';
import PrimaryButton from '../components/PrimaryButton';

import {colors} from '../theme/colors';
import {spacing, radius} from '../theme/spacing';
import {typography} from '../theme/typography';

import {
  moderateScale,
  verticalScale,
} from 'react-native-size-matters';

import {RootStackParamList} from '../navigation/types';

const dplLogo = require('../assets/images/dpl-logo.png');
const avatarIcon = require('../assets/icons/avatar-placeholder.png');
const taskAltIcon = require('../assets/icons/task-alt.png');
const walkIcon = require('../assets/icons/walk.png');
const scheduleIcon = require('../assets/icons/schedule.png');
const micIcon = require('../assets/icons/mic.png');
const infoIcon = require('../assets/icons/info.png');

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

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

const HomeScreen: React.FC = () => {
  const { createAndStartTask } = useTask();
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [taskText, setTaskText] = useState<string>('');
  const [isTopEmployee, setIsTopEmployee] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isStartingTask, setIsStartingTask] = useState<boolean>(false);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  // Refetch every time this screen gains focus — not just on first mount —
  // so the KPI row updates right after finishing a task and coming back
  // from TaskCompleted, without needing a manual pull-to-refresh.
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

  // Fetch the real "Top 10" employee list once, on mount — this is the
  // GET /employees endpoint, which only ever returns active employees.
  useEffect(() => {
    let cancelled = false;
    setEmployeesLoading(true);
    getEmployees()
      .then(res => {
        if (!cancelled) setEmployees(res.items);
      })
      .catch(err => {
        console.warn('Failed to load employees:', err.message);
      })
      .finally(() => {
        if (!cancelled) setEmployeesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleStartTask = async (): Promise<void> => {
    console.log('🔵 Start Task pressed — taskText:', taskText);

    if (!taskText.trim()) {
      Alert.alert(
        'Task Required',
        'Please describe your task before starting.',
      );
      return;
    }

    if (isTopEmployee && !selectedEmployeeId) {
      Alert.alert(
        'Employee Required',
        'Please select an employee for this task.',
      );
      return;
    }

    setIsStartingTask(true);

    try {
      // Grab a fresh GPS fix right now — this is the location the task
      // "starts" at, separate from the ongoing tracking that kicks in
      // once createAndStartTask calls startTracking() internally.
      console.log('🔵 Getting current location...');
      const { latitude, longitude } = await getCurrentLocation();
      console.log('🔵 Got location:', latitude, longitude);

      console.log('🔵 Calling createAndStartTask...');
      const task = await createAndStartTask({
        title: taskText.trim(),
        description: taskText.trim(),
        employeeId: isTopEmployee && selectedEmployeeId ? selectedEmployeeId : undefined,
        latitude,
        longitude,
      });
      console.log('✅ Task created and started:', task.id, task.title);

      setTaskText('');
      setIsTopEmployee(false);
      setSelectedEmployeeId(null);

      navigation.navigate('ActiveTask');
    } catch (error: any) {
      console.log('❌ Start task failed:', error?.message);
      Alert.alert(
        'Could Not Start Task',
        error?.message ?? 'Something went wrong. Please try again.',
      );
    } finally {
      setIsStartingTask(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* TOP APP BAR */}
        <View style={styles.topBar}>
          <Image
            source={dplLogo}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.appBarTitle}>
            DPL Office Boy
          </Text>

          <View style={styles.avatarWrapper}>
            <Image
              source={avatarIcon}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.content}>

          {/* GREETING */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              Good Morning, {user?.name ?? 'Office Boy'}
            </Text>

            <Text style={styles.subGreeting}>
              {user?.role === 'OFFICE_BOY' ? 'Office Boy' : user?.role ?? ''}
            </Text>
          </View>

          {/* KPI ROW */}
          <View style={styles.kpiRow}>
            <KpiCard
              icon={taskAltIcon}
              label="Completed"
              value={statsLoading ? '…' : String(stats?.completedToday ?? 0)}
            />

            <KpiCard
              icon={walkIcon}
              label="Distance"
              value={statsLoading ? '…' : formatKpiDistance(stats?.totalDistanceMeters ?? 0)}
            />

            <KpiCard
              icon={scheduleIcon}
              label="Time"
              value={statsLoading ? '…' : formatKpiDuration(stats?.totalDurationSeconds ?? 0)}
            />
          </View>

          {/* TASK INPUT */}
          <View style={styles.inputSection}>

            <View style={styles.taskInputWrapper}>
              <TextInput
                style={styles.taskInput}
                placeholder="Describe your task..."
                placeholderTextColor={
                  colors.secondaryFixedDim || '#999999'
                }
                value={taskText}
                onChangeText={setTaskText}
                multiline={false}
              />

              <TouchableOpacity
                style={styles.micButton}
                activeOpacity={0.7}>

                <Image
                  source={micIcon}
                  style={styles.micIcon}
                  resizeMode="contain"
                />

              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Image
                source={infoIcon}
                style={styles.infoIcon}
                resizeMode="contain"
              />

              <Text style={styles.infoText}>
                Tap the mic to speak your task
              </Text>
            </View>

          </View>

          {/* TOP 10 EMPLOYEE */}
          <View style={styles.toggleCard}>

            <CheckboxRow
              checked={isTopEmployee}
              onToggle={() =>
                setIsTopEmployee(!isTopEmployee)
              }
              label="This task is for a Top 10 Employee"
            />

            {isTopEmployee && (
              <View style={styles.employeeSection}>

                <Text style={styles.selectLabel}>
                  SELECT EMPLOYEE
                </Text>

                {employeesLoading ? (
                  <ActivityIndicator color={colors.primary} />
                ) : employees.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No active employees found.
                  </Text>
                ) : (
                  <View style={styles.optionsList}>
                    {employees.map(employee => (
                      <TouchableOpacity
                        key={employee.id}
                        style={[
                          styles.optionRow,
                          selectedEmployeeId === employee.id &&
                            styles.optionRowSelected,
                        ]}
                        onPress={() =>
                          setSelectedEmployeeId(employee.id)
                        }
                        activeOpacity={0.7}>

                        <Text style={styles.optionText}>
                          {employee.name}
                        </Text>
                        <Text style={styles.optionSubtext}>
                          {employee.department}
                        </Text>

                      </TouchableOpacity>
                    ))}
                  </View>
                )}

              </View>
            )}

          </View>

          {/* START TASK */}
          <PrimaryButton
            label={
              isStartingTask
                ? 'STARTING...'
                : '▶  START TASK'
            }
            onPress={handleStartTask}
            disabled={isStartingTask}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface || '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface || '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor:
      colors.outlineVariant || '#E0E0E0',
    paddingHorizontal:
      spacing.containerMargin || 16,
    paddingVertical: spacing.xs || 8,
  },

  logo: {
    width: moderateScale(80),
    height: verticalScale(32),
  },

  appBarTitle: {
    ...typography.headlineMd,
    color: colors.primary || '#1976D2',
    fontWeight: 'bold',
  },

  avatarWrapper: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: radius.full || 999,
    borderWidth: 2,
    borderColor:
      colors.primaryContainer || '#BBDEFB',
    overflow: 'hidden',
  },

  avatar: {
    width: '100%',
    height: '100%',
  },

  content: {
    paddingHorizontal:
      spacing.containerMargin || 16,
    paddingVertical: spacing.md || 16,
    gap: spacing.lg || 20,
  },

  greetingContainer: {
    marginBottom: spacing.sm || 8,
  },

  greeting: {
    ...typography.headlineLgMobile,
    color: colors.onSurface || '#1A1A1A',
  },

  subGreeting: {
    ...typography.bodySm,
    color: colors.secondary || '#757575',
  },

  kpiRow: {
    flexDirection: 'row',
    gap: spacing.xs || 4,
    justifyContent: 'space-between',
  },

  inputSection: {
    marginVertical: spacing.sm || 8,
  },

  taskInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm || 8,
    backgroundColor:
      colors.surfaceContainerLowest || '#FFFFFF',
    borderWidth: 1,
    borderColor:
      colors.outlineVariant || '#E0E0E0',
    borderRadius: radius.full || 999,
    paddingLeft: spacing.md || 16,
    paddingRight: spacing.base || 12,
    paddingVertical: spacing.base || 12,
  },

  taskInput: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.onSurface || '#1A1A1A',
    padding: 0,
  },

  micButton: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: radius.full || 999,
    backgroundColor:
      colors.primaryContainer || '#BBDEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  micIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor: colors.onPrimary || '#FFFFFF',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base || 12,
    marginTop: spacing.sm || 8,
    paddingHorizontal: spacing.md || 16,
  },

  infoIcon: {
    width: moderateScale(14),
    height: moderateScale(14),
    tintColor: colors.secondary || '#757575',
  },

  infoText: {
    ...typography.bodySm,
    color: colors.secondary || '#757575',
  },

  toggleCard: {
    backgroundColor:
      colors.surfaceContainerLow || '#F5F5F5',
    borderWidth: 1,
    borderColor:
      colors.outlineVariant || '#E0E0E0',
    borderRadius: radius.xl || 20,
    padding: spacing.md || 16,
    gap: spacing.md || 16,
  },

  employeeSection: {
    marginTop: spacing.sm || 8,
  },

  selectLabel: {
    ...typography.labelCaps,
    color: colors.secondary || '#757575',
    marginBottom: spacing.xs || 4,
  },

  emptyText: {
    ...typography.bodySm,
    color: colors.secondary || '#757575',
  },

  optionsList: {
    gap: spacing.base || 12,
  },

  optionRow: {
    minHeight: verticalScale(48),
    justifyContent: 'center',
    paddingHorizontal: spacing.md || 16,
    paddingVertical: spacing.sm || 8,
    backgroundColor:
      colors.surfaceContainerLowest || '#FFFFFF',
    borderWidth: 1,
    borderColor:
      colors.outlineVariant || '#E0E0E0',
    borderRadius: radius.lg || 16,
  },

  optionRowSelected: {
    borderColor: colors.primary || '#1976D2',
    borderWidth: 2,
  },

  optionText: {
    ...typography.bodyLg,
    color: colors.onSurface || '#1A1A1A',
  },

  optionSubtext: {
    ...typography.bodySm,
    color: colors.secondary || '#757575',
  },
});

export default HomeScreen;
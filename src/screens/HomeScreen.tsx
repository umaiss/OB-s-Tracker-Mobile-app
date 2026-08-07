import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import KpiCard from '../components/KpiCard';
import CheckboxRow from '../components/CheckboxRow';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { RootStackParamList } from '../navigation/types';

const dplLogo = require('../assets/images/dpl-logo.png');
const avatarIcon = require('../assets/icons/avatar-placeholder.png');
const taskAltIcon = require('../assets/icons/task-alt.png');
const walkIcon = require('../assets/icons/walk.png');
const scheduleIcon = require('../assets/icons/schedule.png');
const micIcon = require('../assets/icons/mic.png');
const infoIcon = require('../assets/icons/info.png');

const EMPLOYEE_OPTIONS = ['Ahmed Khan', 'Ali Hassan', 'Zubair Ahmed', 'Fatima Noor'];

type HomeScreenNavigationProp = NativeStackNavigationProp
  RootStackParamList,
  'Main'
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [taskText, setTaskText] = useState<string>('');
  const [isTopEmployee, setIsTopEmployee] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [isStartingTask, setIsStartingTask] = useState<boolean>(false);

  const handleStartTask = (): void => {
    console.log('🔵 Start Task button pressed');

    if (!taskText.trim()) {
      Alert.alert('Task Required', 'Please describe your task before starting.');
      return;
    }

    if (isTopEmployee && !selectedEmployee) {
      Alert.alert('Employee Required', 'Please select an employee for this task.');
      return;
    }

    console.log('🟢 All validations passed');
    setIsStartingTask(true);

    setTimeout(() => {
      console.log('🟡 Navigating to ActiveTask...');
      setIsStartingTask(false);
      try {
        navigation.navigate('ActiveTask');
        console.log('✅ Navigation called successfully');
      } catch (error) {
        console.error('❌ Navigation error:', error);
        Alert.alert('Navigation Error', 'Could not navigate to active task screen.');
      }
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <Image source={dplLogo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appBarTitle}>DPL Office Boy</Text>
          <View style={styles.avatarWrapper}>
            <Image source={avatarIcon} style={styles.avatar} resizeMode="cover" />
          </View>
        </View>

        <View style={styles.content}>
          {/* Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Good Morning, Ahmed</Text>
            <Text style={styles.subGreeting}>Office Boy | Maintenance Dept</Text>
          </View>

          {/* KPI Row */}
          <View style={styles.kpiRow}>
            <KpiCard icon={taskAltIcon} label="Completed" value="3" />
            <KpiCard icon={walkIcon} label="Distance" value="12.4 km" />
            <KpiCard icon={scheduleIcon} label="Time" value="4h 20m" />
          </View>

          {/* Task Input */}
          <View style={styles.inputSection}>
            <View style={styles.taskInputWrapper}>
              <TextInput
                style={styles.taskInput}
                placeholder="Describe your task..."
                placeholderTextColor={colors.secondaryFixedDim || '#999999'}
                value={taskText}
                onChangeText={setTaskText}
                multiline={false}
              />
              <TouchableOpacity style={styles.micButton} activeOpacity={0.7}>
                <Image source={micIcon} style={styles.micIcon} resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Image source={infoIcon} style={styles.infoIcon} resizeMode="contain" />
              <Text style={styles.infoText}>Tap the mic to speak your task</Text>
            </View>
          </View>

          {/* Top 10 Employee Toggle */}
          <View style={styles.toggleCard}>
            <CheckboxRow
              checked={isTopEmployee}
              onToggle={() => setIsTopEmployee(!isTopEmployee)}
              label="This task is for a Top 10 Employee"
            />
            {isTopEmployee && (
              <View style={styles.employeeSection}>
                <Text style={styles.selectLabel}>SELECT EMPLOYEE</Text>
                <View style={styles.optionsList}>
                  {EMPLOYEE_OPTIONS.map((name) => (
                    <TouchableOpacity
                      key={name}
                      style={[
                        styles.optionRow,
                        selectedEmployee === name && styles.optionRowSelected,
                      ]}
                      onPress={() => setSelectedEmployee(name)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionText}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Start Task Button */}
          <PrimaryButton
            label={isStartingTask ? "STARTING..." : "▶  START TASK"}
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
    borderBottomColor: colors.outlineVariant || '#E0E0E0',
    paddingHorizontal: spacing.containerMargin || 16,
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
    borderColor: colors.primaryContainer || '#BBDEFB',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: spacing.containerMargin || 16,
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
    backgroundColor: colors.surfaceContainerLowest || '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.outlineVariant || '#E0E0E0',
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
    backgroundColor: colors.primaryContainer || '#BBDEFB',
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
    backgroundColor: colors.surfaceContainerLow || '#F5F5F5',
    borderWidth: 1,
    borderColor: colors.outlineVariant || '#E0E0E0',
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
  optionsList: {
    gap: spacing.base || 12,
  },
  optionRow: {
    height: verticalScale(48),
    justifyContent: 'center',
    paddingHorizontal: spacing.md || 16,
    backgroundColor: colors.surfaceContainerLowest || '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.outlineVariant || '#E0E0E0',
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
});

export default HomeScreen;
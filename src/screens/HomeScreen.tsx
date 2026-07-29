import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KpiCard from '../components/KpiCard';
import TaskCard from '../components/TaskCard';
import CheckboxRow from '../components/CheckboxRow';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const dplLogo = require('../assets/images/dpl-logo.png');
const avatarIcon = require('../assets/icons/avatar-placeholder.png');
const taskAltIcon = require('../assets/icons/task-alt.png');
const walkIcon = require('../assets/icons/walk.png');
const scheduleIcon = require('../assets/icons/schedule.png');
const micIcon = require('../assets/icons/mic.png');
const infoIcon = require('../assets/icons/info.png');
const mailIcon = require('../assets/icons/mail.png');
const coffeeIcon = require('../assets/icons/coffee.png');
const inventoryIcon = require('../assets/icons/inventory.png');

const EMPLOYEE_OPTIONS = ['Ahmed Khan', 'Ali Hassan', 'Zubair Ahmed', 'Fatima Noor'];

const HomeScreen = () => {
  const [taskText, setTaskText] = useState('');
  const [isTopEmployee, setIsTopEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <View>
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
          <View>
            <View style={styles.taskInputWrapper}>
              <TextInput
                style={styles.taskInput}
                placeholder="Describe your task..."
                placeholderTextColor={colors.secondaryFixedDim}
                value={taskText}
                onChangeText={setTaskText}
              />
              <TouchableOpacity style={styles.micButton}>
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
              <View>
                <Text style={styles.selectLabel}>SELECT EMPLOYEE</Text>
                <View style={styles.optionsList}>
                  {EMPLOYEE_OPTIONS.map(name => (
                    <TouchableOpacity
                      key={name}
                      style={[
                        styles.optionRow,
                        selectedEmployee === name && styles.optionRowSelected,
                      ]}
                      onPress={() => setSelectedEmployee(name)}
                    >
                      <Text style={styles.optionText}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Start Task Button */}
          <PrimaryButton label="▶  START TASK" onPress={() => {}} />

          {/* Recent Tasks */}
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Tasks</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.taskList}>
              <TaskCard
                icon={mailIcon}
                title="Courier Delivery"
                timeRange="10:12 AM - 10:47 AM (35 min)"
                status="Completed"
              />
              <TaskCard
                icon={coffeeIcon}
                title="Cafeteria Service"
                timeRange="09:30 AM - 09:45 AM (15 min)"
                status="Completed"
              />
              <TaskCard
                icon={inventoryIcon}
                title="Stationery Pickup"
                timeRange="08:15 AM - 09:00 AM (45 min)"
                status="Completed"
              />
            </View>
          </View>
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
    paddingVertical: spacing.xs,
  },
  logo: {
    width: moderateScale(80),
    height: verticalScale(32),
  },
  appBarTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: 'bold',
  },
  avatarWrapper: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  greeting: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  subGreeting: {
    ...typography.bodySm,
    color: colors.secondary,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  taskInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.full,
    paddingLeft: spacing.md,
    paddingRight: spacing.base,
    paddingVertical: spacing.base,
  },
  taskInput: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  micButton: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    width: moderateScale(20),
    height: moderateScale(20),
    tintColor: colors.onPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  infoIcon: {
    width: moderateScale(14),
    height: moderateScale(14),
    tintColor: colors.secondary,
  },
  infoText: {
    ...typography.bodySm,
    color: colors.secondary,
  },
  toggleCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  selectLabel: {
    ...typography.labelCaps,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  optionsList: {
    gap: spacing.base,
  },
  optionRow: {
    height: verticalScale(48),
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
  },
  optionRowSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  optionText: {
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  viewAll: {
    ...typography.labelCaps,
    color: colors.primary,
  },
  taskList: {
    gap: spacing.xs,
  },
});

export default HomeScreen;
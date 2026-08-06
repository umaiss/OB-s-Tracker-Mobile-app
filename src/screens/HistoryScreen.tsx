import React, { useState, useMemo } from 'react';
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
import HistoryTaskCard, { TaskStatus } from '../components/HistoryTaskCard';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale } from 'react-native-size-matters';

const searchIcon = require('../assets/icons/search.png');
const backIcon = require('../assets/icons/arrow-back.png');
const historyIcon = require('../assets/icons/history.png');

type HistoryTask = {
  id: string;
  title: string;
  status: TaskStatus;
  timeRange?: string;
  startTime?: string;
  durationDistance?: string;
  dateGroup: 'Today' | 'Yesterday' | 'Previous Week';
};

// Dummy data — matches the shape a real API response would likely have.
// Swap this for a real fetch() later; the rendering logic below won't need to change.
const DUMMY_TASKS: HistoryTask[] = [
  {
    id: '1',
    title: 'Deposit cheque at HBL',
    status: 'completed',
    timeRange: '10:15 AM → 10:48 AM',
    durationDistance: '18 min • 6.2 km',
    dateGroup: 'Today',
  },
  {
    id: '2',
    title: 'Purchase Office Supplies',
    status: 'pending_sync',
    startTime: '09:00 AM',
    dateGroup: 'Today',
  },
  {
    id: '3',
    title: 'Deliver documents to Korangi',
    status: 'cancelled',
    timeRange: '02:30 PM → 03:15 PM',
    durationDistance: '45 min • 12 km',
    dateGroup: 'Yesterday',
  },
  {
    id: '4',
    title: 'Collect Mail from Post Office',
    status: 'completed',
    startTime: 'Oct 12, 11:00 AM',
    dateGroup: 'Previous Week',
  },
  {
    id: '5',
    title: 'Refill Water Dispensers',
    status: 'completed',
    startTime: 'Oct 10, 08:30 AM',
    dateGroup: 'Previous Week',
  },
];

const FILTERS = ['Today', 'This Week', 'This Month', 'All'] as const;
type Filter = (typeof FILTERS)[number];

const HistoryScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  // Client-side filtering for now — swap for a backend query param later if needed.
  const filteredTasks = useMemo(() => {
    return DUMMY_TASKS.filter(task =>
      task.title.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText]);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, HistoryTask[]> = {};
    filteredTasks.forEach(task => {
      if (!groups[task.dateGroup]) groups[task.dateGroup] = [];
      groups[task.dateGroup].push(task);
    });
    return groups;
  }, [filteredTasks]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity>
            <Image source={backIcon} style={styles.backIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>History</Text>
        </View>
        <TouchableOpacity>
          <Image source={searchIcon} style={styles.searchIconTop} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <Image source={searchIcon} style={styles.searchIcon} resizeMode="contain" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by task..."
            placeholderTextColor={colors.secondaryFixedDim}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grouped Task Sections */}
        {Object.entries(groupedTasks).map(([groupName, tasks]) => (
          <View key={groupName} style={styles.section}>
            <Text style={styles.sectionLabel}>{groupName}</Text>
            <View style={styles.taskList}>
              {tasks.map(task => (
                <HistoryTaskCard
                  key={task.id}
                  title={task.title}
                  status={task.status}
                  timeRange={task.timeRange}
                  startTime={task.startTime}
                  durationDistance={task.durationDistance}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Empty state, if search filters everything out */}
        {filteredTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks found.</Text>
          </View>
        )}

        {/* Footer decoration */}
        <View style={styles.footer}>
          <View style={styles.footerIconWrapper}>
            <Image source={historyIcon} style={styles.footerIcon} resizeMode="contain" />
          </View>
          <Text style={styles.footerText}>Showing recent logs</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
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
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  backIcon: {
    width: moderateScale(22),
    height: moderateScale(22),
    tintColor: colors.primary,
  },
  topBarTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: 'bold',
  },
  searchIconTop: {
    width: moderateScale(22),
    height: moderateScale(22),
    tintColor: colors.secondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.containerMargin,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.md,
    width: moderateScale(18),
    height: moderateScale(18),
    tintColor: colors.secondary,
    zIndex: 1,
  },
  searchInput: {
    height: moderateScale(48),
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.full,
    paddingLeft: moderateScale(44),
    paddingRight: spacing.md,
    ...typography.bodySm,
    color: colors.onSurface,
  },
  filterRow: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: moderateScale(8),
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.labelCaps,
    color: colors.secondary,
  },
  filterChipTextActive: {
    color: colors.onPrimary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.labelCaps,
    color: colors.secondary,
    marginBottom: spacing.md,
  },
  taskList: {
    gap: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.bodyLg,
    color: colors.secondary,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    opacity: 0.4,
  },
  footerIconWrapper: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh ?? colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  footerIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    tintColor: colors.secondary,
  },
  footerText: {
    ...typography.labelCaps,
    color: colors.secondary,
  },
});

export default HistoryScreen;
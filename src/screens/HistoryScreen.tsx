import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import HistoryTaskCard, { TaskStatus as CardStatus } from '../components/HistoryTaskCard';
import { getTasks, Task } from '../api/tasksApi';
import { ApiError } from '../api/client';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { moderateScale } from 'react-native-size-matters';

const searchIcon = require('../assets/icons/search.png');
const backIcon = require('../assets/icons/arrow-back.png');
const historyIcon = require('../assets/icons/history.png');

const FILTERS = ['Today', 'This Week', 'This Month', 'All'] as const;
type Filter = (typeof FILTERS)[number];

const PAGE_LIMIT = 20;
const SEARCH_DEBOUNCE_MS = 400;

// ---- date helpers (no external date lib in this project) ----

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(): Date {
  // Monday-start calendar week.
  const d = startOfToday();
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ...
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

function startOfMonth(): Date {
  const d = startOfToday();
  d.setDate(1);
  return d;
}

function filterToRange(filter: Filter): { from?: string; to?: string } {
  const to = new Date().toISOString();
  switch (filter) {
    case 'Today':
      return { from: startOfToday().toISOString(), to };
    case 'This Week':
      return { from: startOfWeek().toISOString(), to };
    case 'This Month':
      return { from: startOfMonth().toISOString(), to };
    case 'All':
    default:
      return {};
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Real tasks include PENDING/IN_PROGRESS — those belong to Home's active-task
// banner, not History, so they're filtered out here rather than forced into
// one of the three badge states this card supports.
function mapTaskToCardStatus(task: Task): CardStatus | null {
  if (task.status === 'CANCELLED') return 'cancelled';
  if (task.status === 'COMPLETED') {
    return task.submittedAt ? 'completed' : 'pending_sync';
  }
  return null;
}

type DateGroup = 'Today' | 'Yesterday' | 'Earlier';

function taskDateGroup(task: Task): DateGroup {
  const ref = new Date(task.endedAt ?? task.startedAt ?? task.createdAt);
  const today = new Date();
  if (isSameDay(ref, today)) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(ref, yesterday)) return 'Yesterday';
  return 'Earlier';
}

const GROUP_ORDER: DateGroup[] = ['Today', 'Yesterday', 'Earlier'];

const HistoryScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false); // full-screen initial/refresh load
  const [loadingMore, setLoadingMore] = useState(false); // bottom "load more" spinner
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState<string | null>(null);

  // Debounce search input so we don't fire a request per keystroke.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(searchText.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchText]);

  const requestId = useRef(0);

  const fetchPage = useCallback(
    async (pageToFetch: number, mode: 'replace' | 'append') => {
      const thisRequest = ++requestId.current;
      if (mode === 'replace') {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const { from, to } = filterToRange(activeFilter);

      try {
        const res = await getTasks({
          page: pageToFetch,
          limit: PAGE_LIMIT,
          from,
          to,
          search: debouncedSearch || undefined,
        });

        // Ignore stale responses if filters/search changed while this was in flight.
        if (thisRequest !== requestId.current) return;

        setTasks(prev => (mode === 'replace' ? res.items : [...prev, ...res.items]));
        setTotal(res.meta.total);
        setPage(pageToFetch);
      } catch (err) {
        if (thisRequest !== requestId.current) return;
        const message = err instanceof ApiError ? err.message : 'Failed to load history.';
        setError(message);
      } finally {
        if (thisRequest !== requestId.current) return;
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [activeFilter, debouncedSearch],
  );

  // Refetch from page 1 whenever the filter or (debounced) search changes.
  useEffect(() => {
    fetchPage(1, 'replace');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, debouncedSearch]);

  // Also refresh on screen focus — e.g. right after submitting a task on
  // TaskCompletedScreen, coming back here should show it as "Completed".
  useFocusEffect(
    useCallback(() => {
      fetchPage(1, 'replace');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilter, debouncedSearch]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPage(1, 'replace');
  };

  const handleLoadMore = () => {
    if (loadingMore || loading) return;
    if (tasks.length >= total) return;
    fetchPage(page + 1, 'append');
  };

  // PENDING/IN_PROGRESS tasks are excluded from History display (see
  // mapTaskToCardStatus) — they belong on Home's active-task banner.
  const groupedTasks = useMemo(() => {
    const groups: Record<DateGroup, Task[]> = { Today: [], Yesterday: [], Earlier: [] };
    tasks.forEach(task => {
      if (mapTaskToCardStatus(task) === null) return;
      groups[taskDateGroup(task)].push(task);
    });
    return groups;
  }, [tasks]);

  const visibleCount = GROUP_ORDER.reduce((sum, g) => sum + groupedTasks[g].length, 0);
  const canLoadMore = tasks.length < total;

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const nearBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;
          if (nearBottom) handleLoadMore();
        }}
        scrollEventThrottle={200}
      >
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

        {/* Initial loading state */}
        {loading && tasks.length === 0 && (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}

        {/* Error state */}
        {error && !loading && (
          <View style={styles.centerState}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchPage(1, 'replace')}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Grouped Task Sections */}
        {!loading &&
          !error &&
          GROUP_ORDER.filter(group => groupedTasks[group].length > 0).map(group => (
            <View key={group} style={styles.section}>
              <Text style={styles.sectionLabel}>{group}</Text>
              <View style={styles.taskList}>
                {groupedTasks[group].map(task => {
                  const cardStatus = mapTaskToCardStatus(task)!;
                  const hasFullRange = !!task.startedAt && !!task.endedAt;
                  const hasDurationDistance =
                    task.status === 'COMPLETED' &&
                    task.durationSeconds != null &&
                    task.distanceMeters != null;

                  return (
                    <HistoryTaskCard
                      key={task.id}
                      title={task.title}
                      status={cardStatus}
                      timeRange={
                        hasFullRange
                          ? `${formatTime(task.startedAt!)} → ${formatTime(task.endedAt!)}`
                          : undefined
                      }
                      startTime={
                        hasFullRange
                          ? undefined
                          : `${formatShortDate(task.startedAt ?? task.createdAt)}, ${formatTime(
                              task.startedAt ?? task.createdAt,
                            )}`
                      }
                      durationDistance={
                        hasDurationDistance
                          ? `${formatDuration(task.durationSeconds!)} • ${formatDistance(task.distanceMeters!)}`
                          : undefined
                      }
                    />
                  );
                })}
              </View>
            </View>
          ))}

        {/* Empty state — no error, finished loading, nothing to show */}
        {!loading && !error && visibleCount === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks found.</Text>
          </View>
        )}

        {/* Load-more spinner (pagination) */}
        {loadingMore && (
          <View style={styles.loadMoreState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}

        {/* Footer decoration — only once everything is loaded */}
        {!loading && !error && !canLoadMore && visibleCount > 0 && (
          <View style={styles.footer}>
            <View style={styles.footerIconWrapper}>
              <Image source={historyIcon} style={styles.footerIcon} resizeMode="contain" />
            </View>
            <Text style={styles.footerText}>That's everything</Text>
          </View>
        )}
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
  centerState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  errorText: {
    ...typography.bodyLg,
    color: colors.secondary,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  retryButtonText: {
    ...typography.labelCaps,
    color: colors.onPrimary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.bodyLg,
    color: colors.secondary,
  },
  loadMoreState: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
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
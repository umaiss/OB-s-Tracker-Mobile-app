import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';

import {useTask} from '../context/TaskContext';
import {useAuth} from '../context/AuthContext';
import {getCurrentLocation} from '../location/locationTracker';

import StatusBadge from '../components/StatusBadge';
import CircularTimer from '../components/CircularTimer';

const homeIcon = require('../assets/icons/home.png');
const historyIcon = require('../assets/icons/history.png');
const personIcon = require('../assets/icons/person.png');

function formatElapsed(startedAt: string): string {
  const startMs = new Date(startedAt).getTime();
  const diffSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  const h = Math.floor(diffSeconds / 3600);
  const m = Math.floor((diffSeconds % 3600) / 60);
  const s = diffSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// No fixed "expected duration" exists for an errand, so the ring cycles
// once per hour as a live visual pulse rather than representing % complete
// toward some unknown target. Adjust this if you'd rather it just fill once.
function computeProgress(startedAt: string): number {
  const startMs = new Date(startedAt).getTime();
  const diffSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  return ((diffSeconds % 3600) / 3600) * 100;
}

function formatDurationShort(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDistanceShort(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}

const ActiveTaskScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {activeTask, endActiveTask} = useTask();
  const {user} = useAuth();

  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [progress, setProgress] = useState(0);
  const [isStopping, setIsStopping] = useState(false);

  // No active task in context — nothing to show here (e.g. app was
  // reloaded mid-task, or this screen was reached without starting one).
  useEffect(() => {
    if (!activeTask || !activeTask.startedAt) {
      navigation.navigate('Main', {screen: 'Home'});
    }
  }, [activeTask, navigation]);

  /*
   * TIMER — derived from the real startedAt timestamp, not a local counter.
   * This means the elapsed time stays correct even if you navigate away
   * and back, since it's recalculated from the actual start time each tick
   * rather than incremented from wherever it last was.
   */
  useEffect(() => {
    if (!activeTask?.startedAt) return;

    setElapsedTime(formatElapsed(activeTask.startedAt));
    setProgress(computeProgress(activeTask.startedAt));

    const timer = setInterval(() => {
      setElapsedTime(formatElapsed(activeTask.startedAt as string));
      setProgress(computeProgress(activeTask.startedAt as string));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTask?.startedAt]);

  const handleStopTask = async () => {
    if (!activeTask) return;
    setIsStopping(true);

    try {
      const {latitude, longitude} = await getCurrentLocation();
      const ended = await endActiveTask(latitude, longitude);

      navigation.replace('TaskCompleted', {
        taskId: ended.id,
        employeeName: user?.name ?? 'Office Boy',
        taskTitle: ended.title,
        duration: formatDurationShort(ended.durationSeconds ?? 0),
        distance: formatDistanceShort(ended.distanceMeters ?? 0),
        destination: ended.destination ?? '—',
      });
    } catch (error: any) {
      Alert.alert(
        'Could Not Stop Task',
        error?.message ?? 'Something went wrong. Please try again.',
      );
    } finally {
      setIsStopping(false);
    }
  };

  /*
   * BOTTOM NAVIGATION
   */
  const goToHome = () => {
    navigation.navigate('Main', {
      screen: 'Home',
    });
  };

  const goToHistory = () => {
    navigation.navigate('Main', {
      screen: 'History',
    });
  };

  const goToProfile = () => {
    navigation.navigate('Main', {
      screen: 'Profile',
    });
  };

  if (!activeTask || !activeTask.startedAt) {
    // Brief flash before the redirect effect above kicks in.
    return <SafeAreaView style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>

    
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* EMPLOYEE HEADER */}

        <View style={styles.employeeContainer}>
          <View>
            <Text style={styles.greeting}>
              Hi, {user?.name ?? 'Office Boy'}
            </Text>

            <Text style={styles.designation}>
              {user?.role ?? 'Office Boy'}
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ================= TASK CARD ================= */}

        <View style={styles.card}>

          {/* STATUS */}

          <View style={styles.badgesContainer}>
            <StatusBadge
              label={activeTask.status}
              type="active"
            />

            <StatusBadge
              label="GPS Active"
              type="gps"
            />
          </View>

          {/* TIMER */}

          <View style={styles.timerContainer}>
            <CircularTimer
              elapsedTime={elapsedTime}
              progress={progress}
            />
          </View>

          {/* TASK DETAILS */}

          <View style={styles.detailsContainer}>

            <Text style={styles.taskTitle}>
              {activeTask.title}
            </Text>

            <View style={styles.trackingContainer}>

              <View style={styles.trackingDot} />

              <Text style={styles.trackingMessage}>
                Location is being tracked
              </Text>

            </View>

          </View>

        </View>
      </ScrollView>

      {/* ================= STOP TASK ================= */}

      <View style={styles.stopButtonContainer}>

        <TouchableOpacity
          style={[styles.stopButton, isStopping && styles.stopButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleStopTask}
          disabled={isStopping}>

          <View style={styles.stopIcon} />

          <Text style={styles.stopButtonText}>
            {isStopping ? 'STOPPING...' : 'STOP TASK'}
          </Text>

        </TouchableOpacity>

      </View>

      {/* ================= BOTTOM NAVIGATION ================= */}

      <View style={styles.bottomNavigation}>

        {/* HOME */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={goToHome}>

          <Image
            source={homeIcon}
            resizeMode="contain"
            style={styles.navIconActive}
          />

          <Text style={styles.navTextActive}>
            Home
          </Text>

        </TouchableOpacity>

        {/* HISTORY */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={goToHistory}>

          <Image
            source={historyIcon}
            resizeMode="contain"
            style={styles.navIcon}
          />

          <Text style={styles.navText}>
            History
          </Text>

        </TouchableOpacity>

        {/* PROFILE */}

        <TouchableOpacity
          style={styles.navItem}
          onPress={goToProfile}>

          <Image
            source={personIcon}
            resizeMode="contain"
            style={styles.navIcon}
          />

          <Text style={styles.navText}>
            Profile
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F7',
  },

  /* ================= HEADER ================= */

  topHeader: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6E5',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },

  backArrow: {
    fontSize: 34,
    color: '#333333',
    lineHeight: 38,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222222',
  },

  /* ================= EMPLOYEE ================= */

  employeeContainer: {
    height: 78,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0DDDA',
    backgroundColor: '#FFF8F7',
  },

  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B91C3C',
    marginBottom: 2,
  },

  designation: {
    fontSize: 11,
    color: '#999999',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8A6A1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  /* ================= CONTENT ================= */

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 14,
    paddingBottom: 180,
  },

  /* ================= TASK CARD ================= */

  card: {
    backgroundColor: '#FDF0EE',
    borderRadius: 18,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,

    borderWidth: 1,
    borderColor: '#F1D8D5',

    shadowColor: '#7A2E2E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  /* ================= TIMER ================= */

  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  /* ================= TASK DETAILS ================= */

  detailsContainer: {
    alignItems: 'center',
    marginTop: 2,
  },

  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#252525',
    textAlign: 'center',
    marginBottom: 5,
  },

  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trackingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 5,
  },

  trackingMessage: {
    fontSize: 11,
    color: '#B91C3C',
    fontWeight: '600',
  },

  /* ================= STOP BUTTON ================= */

  stopButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 76,
    paddingHorizontal: 16,
  },

  stopButton: {
    height: 58,
    backgroundColor: '#C7193F',
    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#8F102D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },

  stopButtonDisabled: {
    opacity: 0.6,
  },

  stopIcon: {
    width: 9,
    height: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    marginRight: 9,
  },

  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* ================= BOTTOM NAV ================= */

  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    height: 70,

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',

    elevation: 10,
  },

  navItem: {
    flex: 1,
    height: 70,

    alignItems: 'center',
    justifyContent: 'center',
  },

  navIcon: {
    width: moderateScale(21),
    height: moderateScale(21),
    tintColor: '#777777',
    marginBottom: 3,
  },

  navIconActive: {
    width: moderateScale(21),
    height: moderateScale(21),
    tintColor: '#C7193F',
    marginBottom: 3,
  },

  navText: {
    fontSize: 10,
    color: '#777777',
    fontWeight: '500',
  },

  navTextActive: {
    fontSize: 10,
    color: '#C7193F',
    fontWeight: '700',
  },
});

export default ActiveTaskScreen;
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
<<<<<<< Updated upstream
=======
  Modal,
>>>>>>> Stashed changes
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';

import {useTask} from '../context/TaskContext';
import {useAuth} from '../context/AuthContext';
import {getCurrentLocation} from '../location/locationTracker';

import StatusBadge from '../components/StatusBadge';
import CircularTimer from '../components/CircularTimer';
import {RootStackParamList} from '../navigation/types';
import {useAuth} from '../context/AuthContext';
import {streamLocations, endTask, cancelTask, StreamedPoint} from '../api/tasksApi';
import {uuidv4} from '../utils/uuid';
import {requestLocationPermission, getCurrentPosition} from '../api/location';

const homeIcon = require('../assets/icons/home.png');
const historyIcon = require('../assets/icons/history.png');
const personIcon = require('../assets/icons/person.png');

<<<<<<< Updated upstream
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
=======
type ActiveTaskRouteProp = RouteProp<RootStackParamList, 'ActiveTask'>;

const FLUSH_INTERVAL_MS = 15000;
const FLUSH_THRESHOLD = 100;

const formatDuration = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(
    s,
  ).padStart(2, '0')}`;
};

const ActiveTaskScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ActiveTaskRouteProp>();
  const {user} = useAuth();
  const insets = useSafeAreaInsets();

  const {taskId, taskTitle, destination} = route.params;

  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [progress, setProgress] = useState(0);
  const [gpsActive, setGpsActive] = useState(true);
  const [stopping, setStopping] = useState(false);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const bufferRef = useRef<StreamedPoint[]>([]);
  const watchIdRef = useRef<number | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const batteryRef = useRef<number>(0);
  const lastLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const isFlushingRef = useRef<boolean>(false);

  /*
   * FLUSH BUFFER
   *
   * Points stay on the device until a batch is confirmed by the server.
   * A successful response clears the buffer — the server dedupes by clientId,
   * so a replayed batch returns accepted: 0 and there is nothing left to send.
   * On a network error the batch is requeued for a later retry.
   */
  const flushBuffer = useCallback(async (): Promise<void> => {
    if (isFlushingRef.current) {
      return;
    }

    const batch = bufferRef.current;

    if (!batch.length) {
      return;
    }

    isFlushingRef.current = true;
    bufferRef.current = [];

    try {
      await streamLocations(taskId, batch);
    } catch (error) {
      console.error('Location batch failed, will retry:', error);
      bufferRef.current = [...batch, ...bufferRef.current];
    } finally {
      isFlushingRef.current = false;
    }
  }, [taskId]);

  /*
   * TIMER + GPS TRACKING
   */
  useEffect(() => {
    let mounted = true;

    const batteryTimer = setInterval(() => {
      DeviceInfo.getBatteryLevel()
        .then(level => {
          batteryRef.current = Math.round(level * 100);
        })
        .catch(() => {});
    }, 30000);

    DeviceInfo.getBatteryLevel()
      .then(level => {
        batteryRef.current = Math.round(level * 100);
      })
      .catch(() => {});

    const setup = async () => {
      const hasPermission = await requestLocationPermission();

      if (!mounted) {
        return;
      }

      if (!hasPermission) {
        setGpsActive(false);
        return;
      }

      getCurrentPosition(15000)
        .then(position => {
          lastLocationRef.current = {
            latitude: position.latitude,
            longitude: position.longitude,
          };
        })
        .catch(() => {
          if (mounted) {
            setGpsActive(false);
          }
        });

      watchIdRef.current = Geolocation.watchPosition(
        position => {
          const {latitude, longitude, accuracy, speed} = position.coords;

          lastLocationRef.current = {latitude, longitude};

          bufferRef.current.push({
            clientId: uuidv4(),
            latitude,
            longitude,
            recordedAt: new Date(position.timestamp).toISOString(),
            accuracyMeters: accuracy ?? 0,
            isMoving: (speed ?? 0) > 0.3,
            batteryLevel: batteryRef.current,
          });

          if (bufferRef.current.length >= FLUSH_THRESHOLD) {
            flushBuffer();
          }
        },
        () => {
          if (mounted) {
            setGpsActive(false);
          }
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 10000,
          fastestInterval: 5000,
        },
      );

      flushTimerRef.current = setInterval(flushBuffer, FLUSH_INTERVAL_MS);
    };

    setup();

    const timer = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - startTimeRef.current) / 1000,
      );
      setElapsedTime(formatDuration(seconds));
      setProgress(Math.min((seconds / 3600) * 100, 100));
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
      clearInterval(batteryTimer);

      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
      }

      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [flushBuffer]);

  /*
   * STOP TASK
   *
   * Flushes any buffered points, ends the task server-side (which computes
   * distance + duration), then moves to the completion screen.
   */
  const handleStopTask = async (): Promise<void> => {
    if (stopping) {
      return;
    }

    setStopping(true);

    try {
      await flushBuffer();

      const current = lastLocationRef.current;

      const task = await endTask(taskId, {
        latitude: current?.latitude ?? 0,
        longitude: current?.longitude ?? 0,
        recordedAt: new Date().toISOString(),
      });

      const durationSeconds =
        task.durationSeconds ??
        Math.floor((Date.now() - startTimeRef.current) / 1000);

      navigation.replace('TaskCompleted', {
        taskId,
        employeeName: user?.name ?? 'Employee',
        taskTitle,
        duration: formatDuration(durationSeconds),
        distance: `${(task.distanceMeters ?? 0).toFixed(2)} m`,
        destination: destination ?? '',
      });
    } catch (error) {
      console.error('End task error:', error);
      Alert.alert(
        'Could Not End Task',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setStopping(false);
    }
  };

  /*
   * CANCEL TASK
   *
   * Ask for a reason, then cancel the task server-side and return Home.
   */
  const confirmCancel = () => {
    setCancelReason('');
    setCancelModalVisible(true);
  };

  const handleCancelConfirm = async (): Promise<void> => {
    if (cancelling) {
      return;
    }

    if (!cancelReason.trim()) {
      Alert.alert(
        'Reason Required',
        'Please enter a reason for cancelling this task.',
      );
      return;
    }

    setCancelling(true);

    try {
      await cancelTask(taskId, {
        cancellationReason: cancelReason.trim(),
      });

      setCancelModalVisible(false);
      goToHome();
    } catch (error) {
      Alert.alert(
        'Cancel Failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setCancelling(false);
>>>>>>> Stashed changes
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
    <SafeAreaView style={styles.container} edges={['top']}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* EMPLOYEE HEADER */}

        <View style={styles.employeeContainer}>
          <View>
            <Text style={styles.greeting}>
<<<<<<< Updated upstream
              Hi, {user?.name ?? 'Office Boy'}
=======
              Hi, {user?.name?.split(' ')[0] ?? 'Employee'}
>>>>>>> Stashed changes
            </Text>

            <Text style={styles.designation}>
              {user?.role ?? 'Office Boy'}
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
<<<<<<< Updated upstream
              {(user?.name ?? 'A').charAt(0).toUpperCase()}
=======
              {(user?.name ?? 'E').charAt(0).toUpperCase()}
>>>>>>> Stashed changes
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
              label={gpsActive ? 'GPS Active' : 'GPS Lost'}
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
<<<<<<< Updated upstream
              {activeTask.title}
=======
              {taskTitle}
>>>>>>> Stashed changes
            </Text>

            {destination ? (
              <Text style={styles.destinationText}>
                {destination}
              </Text>
            ) : null}

            <View style={styles.trackingContainer}>

              <View style={styles.trackingDot} />

              <Text style={styles.trackingMessage}>
                {gpsActive
                  ? 'Location is being tracked'
                  : 'Location unavailable'}
              </Text>

            </View>

          </View>

        </View>
      </ScrollView>

      {/* ================= STOP / CANCEL TASK ================= */}

      <View
        style={[
          styles.stopButtonContainer,
          {bottom: 76 + insets.bottom},
        ]}>

        <TouchableOpacity
<<<<<<< Updated upstream
          style={[styles.stopButton, isStopping && styles.stopButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleStopTask}
          disabled={isStopping}>
=======
          style={[styles.stopButton, (stopping || cancelling) && styles.stopButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleStopTask}
          disabled={stopping || cancelling}>
>>>>>>> Stashed changes

          <View style={styles.stopIcon} />

          <Text style={styles.stopButtonText}>
<<<<<<< Updated upstream
            {isStopping ? 'STOPPING...' : 'STOP TASK'}
=======
            {stopping ? 'STOPPING...' : 'STOP TASK'}
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.cancelButton,
            (stopping || cancelling) && styles.stopButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={confirmCancel}
          disabled={stopping || cancelling}>

          <Text style={styles.cancelButtonText}>
            CANCEL TASK
>>>>>>> Stashed changes
          </Text>

        </TouchableOpacity>

      </View>

      {/* ================= BOTTOM NAVIGATION ================= */}

      <View
        style={[
          styles.bottomNavigation,
          {height: 70 + insets.bottom, paddingBottom: insets.bottom},
        ]}>

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

      {/* ================= CANCEL REASON MODAL ================= */}

      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cancel Task</Text>
            <Text style={styles.modalSubtitle}>
              Tell us why you are cancelling this task.
            </Text>

            <TextInput
              style={styles.modalInput}
              value={cancelReason}
              onChangeText={setCancelReason}
              placeholder="Reason for cancellation"
              placeholderTextColor="#A0A0A0"
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBack}
                onPress={() => setCancelModalVisible(false)}
                disabled={cancelling}>
                <Text style={styles.modalBackText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleCancelConfirm}
                disabled={cancelling}>
                <Text style={styles.modalConfirmText}>
                  {cancelling ? 'CANCELLING...' : 'CANCEL TASK'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    paddingBottom: 270,
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

  destinationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A2E2E',
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
    gap: 12,
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

  cancelButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C7193F',
    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#C7193F',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* ================= CANCEL MODAL ================= */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#222222',
    marginBottom: 6,
  },

  modalSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 14,
  },

  modalInput: {
    minHeight: 84,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 13,
    color: '#222222',
    textAlignVertical: 'top',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  modalBack: {
    flex: 1,
    height: 46,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#C7193F',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalBackText: {
    color: '#C7193F',
    fontSize: 13,
    fontWeight: '800',
  },

  modalConfirm: {
    flex: 2,
    height: 46,
    borderRadius: 9,
    backgroundColor: '#C7193F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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

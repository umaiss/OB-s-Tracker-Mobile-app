import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import CircularTimer from '../components/CircularTimer';
import PrimaryButton from '../components/PrimaryButton';
import { RootStackParamList } from '../navigation/types';

interface TaskData {
  employeeName: string;
  designation: string;
  avatar?: string;
  status: string;
  gpsStatus: string;
  elapsedTime: string;
  taskTitle: string;
  trackingMessage: string;
  progress: number;
}

type ActiveTaskScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ActiveTask'
>;

const ActiveTaskScreen: React.FC = () => {
  const navigation = useNavigation<ActiveTaskScreenNavigationProp>();

  const [loading, setLoading] = useState(false);

  const [taskData, setTaskData] = useState<TaskData>({
    employeeName: 'Ahmed',
    designation: 'Office Boy',
    avatar: '',
    status: 'ACTIVE',
    gpsStatus: 'GPS Active',
    elapsedTime: '00:21:44',
    taskTitle: 'Deposit cheque at HBL',
    trackingMessage: 'Location is being tracked',
    progress: 72,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTaskData(prev => {
        const [hours, minutes, seconds] = prev.elapsedTime
          .split(':')
          .map(Number);

        let h = hours;
        let m = minutes;
        let s = seconds + 1;

        if (s >= 60) {
          s = 0;
          m++;
        }

        if (m >= 60) {
          m = 0;
          h++;
        }

        return {
          ...prev,
          elapsedTime: `${String(h).padStart(2, '0')}:${String(m).padStart(
            2,
            '0',
          )}:${String(s).padStart(2, '0')}`,
          progress: Math.min(prev.progress + 0.1, 100),
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStopTask = () => {
    setLoading(true);

    // Replace this later with your backend API call
    setTimeout(() => {
      setLoading(false);

      // FIX: navigate() bubbles up to find TaskCompleted in the parent
      // navigator; replace() does not, which caused the "REPLACE action
      // not handled by any navigator" error. Also now passing real
      // task data as params instead of nothing.
      navigation.navigate('TaskCompleted', {
        employeeName: taskData.employeeName,
        taskTitle: taskData.taskTitle,
        duration: taskData.elapsedTime,
        // distance/destination are placeholders until your task data
        // model includes them - swap these for real values from your API.
        distance: '6.2 km',
        destination: 'HBL Bank, Satellite Town',
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={taskData.employeeName}
        designation={taskData.designation}
        avatar={taskData.avatar}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.badgesContainer}>
            <StatusBadge label={taskData.status} type="active" />
            <StatusBadge label={taskData.gpsStatus} type="gps" />
          </View>

          <CircularTimer
            elapsedTime={taskData.elapsedTime}
            progress={taskData.progress}
          />

          <View style={styles.detailsContainer}>
            <Text style={styles.taskTitle}>{taskData.taskTitle}</Text>

            <View style={styles.trackingContainer}>
              <View style={styles.trackingDot} />

              <Text style={styles.trackingMessage}>
                {taskData.trackingMessage}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          label={loading ? 'STOPPING...' : 'STOP TASK'}
          onPress={handleStopTask}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF2F1',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
    paddingTop: 8,
  },

  bottomPadding: {
    height: 20,
  },

  card: {
    backgroundColor: '#FCEEEC',
    borderRadius: 22,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 14,
    shadowColor: '#7A2E2E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  badgesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },

  detailsContainer: {
    marginTop: 8,
    alignItems: 'center',
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 6,
    textAlign: 'center',
  },

  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  trackingDot: {
    width: 0,
    height: 0,
  },

  trackingMessage: {
    fontSize: 13,
    color: '#B91C3C',
    fontWeight: '600',
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
});

export default ActiveTaskScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface TaskCompletedData {
  employeeName: string;
  taskTitle: string;
  duration: string;
  distance: string;
  destination: string;
  mapImageUrl?: string;
}

const TaskCompletedScreen: React.FC = () => {
  const [remarks, setRemarks] = useState<string>('');

  // Replace with real data passed via navigation route params / API response
  const [taskData] = useState<TaskCompletedData>({
    employeeName: 'Ahmed',
    taskTitle: 'Deposit cheque at HBL',
    duration: '18 Minutes',
    distance: '6.2 km',
    destination: 'HBL Bank, Satellite Town',
    mapImageUrl: undefined,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page title */}
        <Text style={styles.pageTitle}>Task Completed</Text>

        {/* Success badge */}
        <View style={styles.successSection}>
          <View style={styles.checkBadge}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <Text style={styles.successTitle}>✓ Task Completed</Text>
          <Text style={styles.successSubtitle}>
            Great job, {taskData.employeeName}!
          </Text>
        </View>

        {/* Task summary card */}
        <View style={styles.card}>
          <Text style={styles.activeTaskLabel}>ACTIVE TASK</Text>
          <Text style={styles.taskTitle}>{taskData.taskTitle}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⏱</Text>
              <View>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{taskData.duration}</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📏</Text>
              <View>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{taskData.distance}</Text>
              </View>
            </View>
          </View>

          <View style={styles.destinationRow}>
            <Text style={styles.statIcon}>📍</Text>
            <View>
              <Text style={styles.statLabel}>Destination</Text>
              <Text style={styles.statValue}>{taskData.destination}</Text>
            </View>
          </View>
        </View>

        {/* Map preview */}
        <View style={styles.mapWrapper}>
          {taskData.mapImageUrl ? (
            <Image source={{ uri: taskData.mapImageUrl }} style={styles.mapImage} />
          ) : (
            <View style={styles.mapPlaceholder}>
              <View style={styles.routeLine} />
              <Text style={styles.mapPlaceholderText}>Route Preview</Text>
            </View>
          )}
        </View>

        {/* Remarks */}
        <View style={styles.remarksSection}>
          <Text style={styles.remarksLabel}>
            Remarks <Text style={styles.optionalText}>(Optional)</Text>
          </Text>
          <TextInput
            style={styles.remarksInput}
            placeholder="Task completed"
            placeholderTextColor="#B0B0B0"
            value={remarks}
            onChangeText={setRemarks}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const RED = '#DC2626';
const GREEN = '#22C55E';
const INK = '#1A1A2E';
const MUTED = '#8A8A8A';
const BLUE = '#3B82F6';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: RED,
    textAlign: 'center',
    marginBottom: 20,
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkBadge: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  successTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: INK,
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 13,
    color: MUTED,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activeTaskLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: RED,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: INK,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    paddingTop: 14,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: INK,
  },
  mapWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
    height: 150,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8EAED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: {
    position: 'absolute',
    width: 120,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 2,
    transform: [{ rotate: '35deg' }],
  },
  mapPlaceholderText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  remarksSection: {
    marginBottom: 8,
  },
  remarksLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: INK,
    marginBottom: 10,
  },
  optionalText: {
    fontSize: 13,
    fontWeight: '500',
    color: BLUE,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: INK,
    textAlignVertical: 'top',
    minHeight: 80,
    backgroundColor: '#FAFAFA',
  },
  bottomPadding: {
    height: 20,
  },
});

export default TaskCompletedScreen;

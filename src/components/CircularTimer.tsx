import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CircularTimerProps {
  elapsedTime: string;
  progress: number; // 0-100, reserved for future arc-based progress rendering
}

const SIZE = 210;
const RING_WIDTH = 14;

const CircularTimer: React.FC<CircularTimerProps> = ({ elapsedTime }) => {
  return (
    <View style={styles.wrapper}>
      {/* Outer ring */}
      <View style={styles.outerRing}>
        {/* Flag marker at top of the ring */}
        <View style={styles.flagMarker} />

        {/* Inner filled circle */}
        <View style={styles.innerCircle}>
          <Text style={styles.timeText}>{elapsedTime}</Text>
          <Text style={styles.caption}>ELAPSED TIME</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  outerRing: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#F2C9C5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagMarker: {
    position: 'absolute',
    top: 2,
    width: 22,
    height: 10,
    borderRadius: 3,
    backgroundColor: '#E11D2E',
  },
  innerCircle: {
    width: SIZE - RING_WIDTH * 2,
    height: SIZE - RING_WIDTH * 2,
    borderRadius: (SIZE - RING_WIDTH * 2) / 2,
    backgroundColor: '#EDD9D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#7A2E2E',
    letterSpacing: 1,
  },
  caption: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#9B7C78',
    letterSpacing: 1,
  },
});

export default CircularTimer;

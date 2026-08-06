import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusBadgeProps {
  label: string;
  type: 'active' | 'gps';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, type }) => {
  const isActive = type === 'active';

  return (
    <View
      style={[
        styles.badge,
        isActive ? styles.activeBadge : styles.gpsBadge,
      ]}
    >
      {isActive ? (
        <View style={styles.activeDot} />
      ) : (
        <Text style={styles.pinIcon}>📍</Text>
      )}
      <Text style={[styles.label, isActive ? styles.activeLabel : styles.gpsLabel]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  activeBadge: {
    backgroundColor: '#DCFCE7',
  },
  gpsBadge: {
    backgroundColor: '#FFFFFF',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  pinIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeLabel: {
    color: '#16A34A',
  },
  gpsLabel: {
    color: '#B91C3C',
  },
});

export default StatusBadge;

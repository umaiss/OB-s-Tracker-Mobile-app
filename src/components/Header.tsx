import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  name: string;
  designation: string;
  avatar?: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ name, designation, avatar, showBack, onBackPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.greeting}>Hi, {name}</Text>
          <Text style={styles.designation}>{designation}</Text>
        </View>
      </View>

      <View style={styles.avatarWrapper}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{name.charAt(0)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FBF2F1',
    borderBottomWidth: 1,
    borderBottomColor: '#F3E1DE',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    paddingRight: 4,
  },
  backArrow: {
    fontSize: 26,
    color: '#B91C3C',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B91C3C',
  },
  designation: {
    fontSize: 12,
    color: '#9B7C78',
    marginTop: 2,
  },
  avatarWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#F3D3CE',
    padding: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarPlaceholder: {
    backgroundColor: '#E8B4AE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Header;

// Example: wherever your Bottom Tab Navigator is set up
// (e.g. src/navigation/BottomTabNavigator.tsx)
//
// This is a REFERENCE snippet showing the screenOptions needed to match
// the red-accented tab bar in your screenshot. Merge these options into
// your existing Tab.Navigator — don't replace your actual screens/logic.

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const ACTIVE_RED = '#B91C3C';
const INACTIVE_GRAY = '#9CA3AF';

// Simple text-based icons (no extra icon library required).
// Swap these Text glyphs for react-native-vector-icons if you have it installed.
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const glyphs: Record<string, string> = {
    Home: '⌂',
    History: '↻',
    Profile: '☺',
  };
  return null; // placeholder - replace with actual <Text> icon in your TabIcon component
}

export function screenOptionsExample({ route }: any) {
  return {
    headerShown: false,
    tabBarActiveTintColor: ACTIVE_RED,
    tabBarInactiveTintColor: INACTIVE_GRAY,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#F0E5E3',
      height: 64,
      paddingTop: 8,
      paddingBottom: 8,
    },
  };
}

// Usage in your navigator:
//
// <Tab.Navigator screenOptions={screenOptionsExample}>
//   <Tab.Screen name="Home" component={HomeScreen} />
//   <Tab.Screen name="History" component={HistoryScreen} />
//   <Tab.Screen name="Profile" component={ProfileScreen} />
// </Tab.Navigator>

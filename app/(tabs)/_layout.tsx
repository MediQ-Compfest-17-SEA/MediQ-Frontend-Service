import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import IonIcons from "@expo/vector-icons/build/Ionicons"

export default function TabLayout() {


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IonIcons name="home" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

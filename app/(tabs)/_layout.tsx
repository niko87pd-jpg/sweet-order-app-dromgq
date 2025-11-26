
import React from 'react';
import { Platform } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { isAdmin, user } = useAuth();
  
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'house.fill',
      label: 'Home',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'info.circle.fill',
      label: 'Info Due Mondi',
    },
  ];

  // Add admin tab only if user is logged in and is admin
  if (user && isAdmin) {
    tabs.push({
      name: 'admin',
      route: '/(tabs)/admin',
      icon: 'person.2.fill',
      label: 'Admin',
    });
  }

  if (Platform.OS === 'ios') {
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <Icon sf="house.fill" drawable="ic_home" />
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="info.circle.fill" drawable="ic_info" />
          <Label>Info Due Mondi</Label>
        </NativeTabs.Trigger>
        {user && isAdmin && (
          <NativeTabs.Trigger name="admin">
            <Icon sf="person.2.fill" drawable="ic_admin" />
            <Label>Admin</Label>
          </NativeTabs.Trigger>
        )}
      </NativeTabs>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="admin" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}

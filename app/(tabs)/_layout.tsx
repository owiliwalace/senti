import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Chats"
        options={{
         title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="chatbox-ellipses-outline" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title:'',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="user" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

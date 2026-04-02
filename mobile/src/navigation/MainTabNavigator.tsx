import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList, FeedStackParamList, ChatStackParamList } from './types';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Shadow } from '../constants/layout';

// Screens
import FeedScreen from '../screens/feed/FeedScreen';
import ProductDetailScreen from '../screens/feed/ProductDetailScreen';
import PublishScreen from '../screens/publish/PublishScreen';
import InboxScreen from '../screens/chat/InboxScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Feed Stack
const FeedStack = createStackNavigator<FeedStackParamList>();
const FeedNavigator = () => (
  <FeedStack.Navigator screenOptions={{ headerShown: false }}>
    <FeedStack.Screen name="FeedHome" component={FeedScreen} />
    <FeedStack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
    />
  </FeedStack.Navigator>
);

// Chat Stack
const ChatStack = createStackNavigator<ChatStackParamList>();
const ChatNavigator = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="Inbox" component={InboxScreen} />
    <ChatStack.Screen
      name="Chat"
      component={ChatScreen}
    />
  </ChatStack.Navigator>
);

// Custom center tab button
const PublishTabButton = ({ onPress }: { onPress?: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.publishButtonWrapper}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.publishButton}
      >
        <Ionicons name="add" size={28} color={Colors.textInverse} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Main Tab Navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: FontWeight.medium,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 4,
          ...Shadow.lg,
        },
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedNavigator}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PublishTab"
        component={PublishScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => <PublishTabButton onPress={props.onPress as () => void} />,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatNavigator}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: Colors.primary,
            color: Colors.textInverse,
            fontSize: 10,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            lineHeight: 18,
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  publishButtonWrapper: {
    position: 'relative',
    top: -16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  publishButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.card,
  },
});

export default MainTabNavigator;

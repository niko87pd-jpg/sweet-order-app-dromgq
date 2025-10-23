
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = tabs.findIndex((tab) => {
    if (tab.name === '(home)') {
      return pathname.startsWith('/(tabs)/(home)');
    }
    return pathname === tab.route;
  });

  const translateX = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  React.useEffect(() => {
    if (activeIndex >= 0) {
      translateX.value = withSpring(activeIndex, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            translateX.value,
            [0, tabs.length - 1],
            [0, tabWidth * (tabs.length - 1)]
          ),
        },
      ],
    };
  });

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeArea, { marginBottom: bottomMargin }]}
    >
      <BlurView
        intensity={80}
        tint="light"
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius: borderRadius,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.indicator,
            {
              width: containerWidth / tabs.length,
              borderRadius: borderRadius - 5,
              backgroundColor: colors.primary,
            },
            animatedStyle,
          ]}
        />
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => handleTabPress(tab.route)}
            >
              <IconSymbol
                name={tab.icon as any}
                size={24}
                color={isActive ? '#FFFFFF' : colors.text}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 70,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    elevation: 8,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    height: 60,
    top: 5,
    left: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});

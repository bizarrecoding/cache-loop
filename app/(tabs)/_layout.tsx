import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import { useThemeColor } from '@/components/Themed';

const TabBarIcon = React.memo((props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) => {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
})

TabBarIcon.displayName = "TabBarIcon";

const TabLayout = () => {
  const accentColor = useThemeColor({},"accent") 
  return (
    <Tabs initialRouteName='season'
      screenOptions={{
        animation: 'shift',
        tabBarActiveTintColor: accentColor as string,
        freezeOnBlur: true, // Keep screens mounted
        lazy: true, // prepare screen before accessing
      }}
    > 
      <Tabs.Screen
        name="season"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar-plus-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cache"
        options={{
          title: 'cache',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="info" color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
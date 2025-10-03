/* eslint-disable react/no-unstable-nested-components */
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../common/constant/Themes';
import HomeMainIndex from '../modules/home/HomeMainIndex';
import ActionItemMainIndex from '../modules/action-item/ActionItemMainIndex';
import NotificationMainIndex from '../modules/notification/NotificationMainIndex';
import MenuMainIndex from '../modules/menu/MenuMainIndex';
import {useRootStore} from '../stores/rootStore';

const {Navigator, Screen} = createMaterialBottomTabNavigator<any>();
const BottomTab = () => {
  const {bottom} = useSafeAreaInsets();
  const {userInfo} = useRootStore();

  return (
    <Navigator
      sceneAnimationEnabled={true}
      initialRouteName="BottomTab"
      activeColor={COLORS.primary}
      inactiveColor={COLORS.graySubText}
      barStyle={{backgroundColor: COLORS.lightGray3}}
      safeAreaInsets={{bottom}}
      labeled={true}
      shifting={false}>
      <Screen
        name="Home"
        component={HomeMainIndex}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Screen
        name="ActionItem"
        component={ActionItemMainIndex}
        options={{
          tabBarLabel: 'Action Items',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'view-list' : 'view-list-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Screen
        name="Notification"
        component={NotificationMainIndex}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'email' : 'email-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Screen
        name="Menu"
        component={MenuMainIndex}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'menu-open' : 'menu'}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Navigator>
  );
};

export default BottomTab;

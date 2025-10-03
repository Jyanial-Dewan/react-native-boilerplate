import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import Loader from '../auth/Loader';
import LoginScreen from '../auth/LoginScreen';
import {RootStackScreensParms} from '../types/navigationTs/RootStackScreenParams';
import BottomTab from './BottomTab';
import ProfileScreen from '../modules/profile/ProfileScreen';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackScreensParms {}
  }
}
export type RootStackScreens = keyof RootStackScreensParms;

export type RootStackScreenProps<T extends RootStackScreens> =
  NativeStackScreenProps<RootStackScreensParms, T>;

const {Navigator, Screen} = createNativeStackNavigator<RootStackScreensParms>();

const RootStack = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="Loader" component={Loader} />
      <Screen name="Login" component={LoginScreen} />
      <Screen name="HomeScreen" component={BottomTab} />
      <Screen name="ProfileScreen" component={ProfileScreen} />
    </Navigator>
  );
};

export default RootStack;

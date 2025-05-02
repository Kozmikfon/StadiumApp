import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PlayerListScreen from '../screens/PlayerListScreen';
import { RootStackParamList } from '..//navigation/props/types'; // Ekran tiplerini içe aktarıyoruz

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PlayerList" component={PlayerListScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './navigation/RootNavigation';

const AuthLoadingScreen = () => {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        navigationRef.navigate('Home');
      } else {
        navigationRef.navigate('Login');
      }
    };

    checkToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AuthLoadingScreen;

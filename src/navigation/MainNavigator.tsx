import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/login/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen';
import PlayerPanelScreen from '../screens/panels/PlayerPanelScreen'; // Eklenmeli
import UserPanelScreen from '../screens/panels/UserPanelScreen';     // Eklenmeli
import CompletePlayerProfile from '../screens/playerPanel/CompletePlayerProfile';
import RegisterScreen from '../screens/login/RegisterScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="PlayerPanel" component={PlayerPanelScreen} />
                <Stack.Screen name="UserPanel" component={UserPanelScreen} /> 
                <Stack.Screen name="CompletePlayerProfile" component={CompletePlayerProfile} />
                <Stack.Screen name='Register' component={RegisterScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainNavigator;

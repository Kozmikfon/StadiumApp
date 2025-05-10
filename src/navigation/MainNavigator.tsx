import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/login/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen';
import PlayerPanelScreen from '../screens/panels/PlayerPanelScreen'; // Eklenmeli
import UserPanelScreen from '../screens/userPanel/UserPanelScreen';     // Eklenmeli
import CompletePlayerProfile from '../screens/playerPanel/CompletePlayerProfile';
import RegisterScreen from '../screens/login/RegisterScreen';
import PlayerList from '../screens/playerPanel/PlayerListScreen';
import TeamList from '../screens/TeamPanel/TeamList';
import TeamDetail from '../screens/TeamPanel/TeamDetail';
import MatchList from '../screens/matches/MatchList';
import PlayerDetail from '../screens/playerPanel/PlayerDetail';
import CreateMatchScreen from '../screens/matches/CreateMatchScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="PlayerPanel" component={PlayerPanelScreen} />
            <Stack.Screen name="UserPanel" component={UserPanelScreen} />  
            <Stack.Screen name="CompletePlayerProfile" component={CompletePlayerProfile} />
            <Stack.Screen name='Register' component={RegisterScreen}/>
            <Stack.Screen name="PlayerList" component={PlayerList} />
            <Stack.Screen name="TeamList" component={TeamList} />
            <Stack.Screen name="TeamDetail" component={TeamDetail} />
            <Stack.Screen name="MatchList" component={MatchList} />
            <Stack.Screen name="PlayerDetail" component={PlayerDetail} />
            <Stack.Screen name="CreateMatch" component={CreateMatchScreen} />

        </Stack.Navigator>
    );
};

export default MainNavigator;

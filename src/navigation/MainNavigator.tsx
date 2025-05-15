import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/login/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen';
import UserPanelScreen from '../screens/userPanel/UserPanelScreen';     // Eklenmeli
import CompletePlayerProfile from '../screens/userPanel/CompletePlayerProfile';
import RegisterScreen from '../screens/login/RegisterScreen';
import PlayerList from '../screens/playerPanel/PlayerListScreen';
import TeamList from '../screens/TeamPanel/TeamList';
import TeamDetail from '../screens/TeamPanel/TeamDetail';
import MatchList from '../screens/matches/MatchList';
import PlayerDetail from '../screens/playerPanel/PlayerDetail';
import CreateMatchScreen from '../screens/matches/CreateMatchScreen';
import PlayerProfileScreen from '../screens/userPanel/panels/PlayerProfileScreen';
import MyMatchesScreen from '../screens/matches/MyMatchesScreen';
import SendOfferScreen from '../screens/playerPanel/SendOfferScreen';
import MyOffersScreen from '../screens/playerPanel/MyOffersScreen';
import MatchDetailScreen from '../screens/matches/MatchDetailScreen';
import CreateTeamScreen from '../screens/TeamPanel/CreateTeamScreen';
import CreateReviewScreen from '../screens/Review/CreateReviewScreen';
import EditPlayerProfileScreen from '../screens/playerPanel/EditPlayerProfileScreen';
import MyReviewsScreen from '../screens/Review/MyReviewsScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
            <Stack.Screen name="UserPanel" component={UserPanelScreen} />  
            <Stack.Screen name="CompletePlayerProfile" component={CompletePlayerProfile} />
            <Stack.Screen name='Register' component={RegisterScreen}/>
            <Stack.Screen name="PlayerList" component={PlayerList} />
            <Stack.Screen name="TeamList" component={TeamList} />
            <Stack.Screen name="TeamDetail" component={TeamDetail} />
            <Stack.Screen name="MatchList" component={MatchList} />
            <Stack.Screen name="PlayerDetail" component={PlayerDetail} />
            <Stack.Screen name="CreateMatch" component={CreateMatchScreen} />
            <Stack.Screen name="MyMatches" component={MyMatchesScreen} initialParams={{ filter: 'myMatches' }} />
            <Stack.Screen name="SendOffer" component={SendOfferScreen} initialParams={{ filter: 'myOffers' }} />
            <Stack.Screen name="MyOffers" component={MyOffersScreen} />
            <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
            <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
            <Stack.Screen name="CreateReview" component={CreateReviewScreen} />
            <Stack.Screen name="EditPlayerProfile" component={EditPlayerProfileScreen} />
            <Stack.Screen name="MyReviews" component={MyReviewsScreen} />

            
        </Stack.Navigator>
    );
};

export default MainNavigator;

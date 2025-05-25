import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import BottomNavbar from '../components/BottomNavbar';

// Sayfa importları...
import SplashScreen from '../screens/login/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/login/LoginScreen';
import UserPanelScreen from '../screens/userPanel/UserPanelScreen';
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
import SendOfferScreen from '../screens/Offers/SendOfferScreen';
import MyOffersScreen from '../screens/Offers/MyOffersScreen';
import MatchDetailScreen from '../screens/matches/MatchDetailScreen';
import CreateTeamScreen from '../screens/TeamPanel/CreateTeamScreen';
import CreateReviewScreen from '../screens/Review/CreateReviewScreen';
import EditPlayerProfileScreen from '../screens/playerPanel/EditPlayerProfileScreen';
import MyReviewsScreen from '../screens/Review/MyReviewsScreen';
import MyTeamScreen from '../screens/TeamPanel/MyTeamScreen';
import ChangeCaptainScreen from '../screens/TeamPanel/ChangeCaptainScreen';
import SelectTeam1Screen from '../screens/TeamPanel/SelectTeam/SelectTeam1Screen';
import SelectTeam2Screen from '../screens/TeamPanel/SelectTeam/SelectTeam2Screen';
import TeamCompareScreen from '../screens/TeamPanel/SelectTeam/TeamCompareScreen';
import TopTeamsScreen from '../screens/TeamPanel/TopTeam/TopTeamsScreen';
import TopPlayersScreen from '../screens/playerPanel/TopPlayer/TopPlayersScreen';
import MatchCalendarScreen from '../screens/matches/calendar/MatchCalendarScreen';
import CaptainOffersScreen from '../screens/Offers/CaptainOffersScreen';
import MatchReviewsScreen from '../screens/Review/MatchReviewsScreen';
import MarkAttendanceScreen from '../screens/Attendance/MarkAttendanceScreen';
import MatchStatsScreen from '../screens/MatchStat/MatchStatsScreen';
import TurnuvaScreen from '../screens/Tournament/TurnuvaScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  return (
    <View style={styles.container}>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CompletePlayerProfile" component={CompletePlayerProfile} />
        <Stack.Screen name="UserPanel" component={UserPanelScreen} />
        <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} />
        <Stack.Screen name="PlayerList" component={PlayerList} />
        <Stack.Screen name="PlayerDetail" component={PlayerDetail} />
        <Stack.Screen name="EditPlayerProfile" component={EditPlayerProfileScreen} />
        <Stack.Screen name="MyReviews" component={MyReviewsScreen} />
        <Stack.Screen name="TeamList" component={TeamList} />
        <Stack.Screen name="TeamDetail" component={TeamDetail} />
        <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
        <Stack.Screen name="MyTeam" component={MyTeamScreen} />
        <Stack.Screen name="ChangeCaptain" component={ChangeCaptainScreen} />
        <Stack.Screen name="SelectTeam1" component={SelectTeam1Screen} />
        <Stack.Screen name="SelectTeam2" component={SelectTeam2Screen} />
        <Stack.Screen name="TeamCompare" component={TeamCompareScreen} />
        <Stack.Screen name="TopTeams" component={TopTeamsScreen} />
        <Stack.Screen name="TopPlayers" component={TopPlayersScreen} />
        <Stack.Screen name="MatchList" component={MatchList} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
        <Stack.Screen name="CreateMatch" component={CreateMatchScreen} />
        <Stack.Screen name="MyMatches" component={MyMatchesScreen} />
        <Stack.Screen name="MatchCalendar" component={MatchCalendarScreen} />
        <Stack.Screen name="MatchReviews" component={MatchReviewsScreen} />
        <Stack.Screen name="CreateReview" component={CreateReviewScreen} />
        <Stack.Screen name="SendOffer" component={SendOfferScreen} />
        <Stack.Screen name="MyOffers" component={MyOffersScreen} />
        <Stack.Screen name="CaptainOffer" component={CaptainOffersScreen} />
        <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} />
        <Stack.Screen name="MatchStats" component={MatchStatsScreen} />
        <Stack.Screen name="Turnuva" component={TurnuvaScreen} />
      </Stack.Navigator>

      {/* 🔻 Splash ekranı dışındaki sayfalarda navbar göster */}
      {routeName !== 'Splash' && <BottomNavbar activeRoute={routeName} />}
    </View>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

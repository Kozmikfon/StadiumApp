import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';


interface Team {
  id: number;
  name: string;
}

interface Match {
  id: number;
  fieldName: string;
  matchDate: string;
  team1: Team;
  team2: Team;
}

interface Standing {
  teamId: number;
  teamName: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
}
interface DecodedToken {
  userId: number;
  playerId: number;
  // varsa diğer alanlar
}

const API_URL = 'http://10.0.2.2:5275/api';

const TurnuvaScreen = () => {
const [teams, setTeams] = useState<Team[]>([]);
const [matches, setMatches] = useState<Match[]>([]);
const [standings, setStandings] = useState<Standing[]>([]);
const [playerId, setPlayerId] = useState(null);
const [currentTeamId, setCurrentTeamId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
const token = await AsyncStorage.getItem('token');
if (!token) return;

const decoded = jwtDecode<DecodedToken>(token);
const userId = decoded.userId;


        const playerRes = await axios.get(`${API_URL}/players/byUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPlayerId(playerRes.data.id);
        setCurrentTeamId(playerRes.data.teamId);

        const teamRes = await axios.get(`${API_URL}/Teams/tournament-teams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(teamRes.data);

        const matchRes = await axios.get(`${API_URL}/Matches/tournament-matches`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(matchRes.data);

        calculateStandings(matchRes.data);
      } catch (err) {
        console.error("Veri alınırken hata:", err);
      }
    };

    fetchData();
  }, []);

 const calculateStandings = (matchList: Match[]) => {
  const table: { [key: number]: Standing } = {};

  matchList.forEach((match) => {
    if (!match.team1 || !match.team2) return;

    const team1Id = match.team1.id;
    const team2Id = match.team2.id;

    const team1Score = Math.floor(Math.random() * 4);
    const team2Score = Math.floor(Math.random() * 4);

    [team1Id, team2Id].forEach((teamId) => {
      if (!table[teamId]) {
        const team = teamId === team1Id ? match.team1 : match.team2;
        table[teamId] = {
          teamId,
          teamName: team.name,
          played: 0,
          won: 0,
          draw: 0,
          lost: 0,
          points: 0,
        };
      }
    });

    table[team1Id].played += 1;
    table[team2Id].played += 1;

    if (team1Score > team2Score) {
      table[team1Id].won += 1;
      table[team2Id].lost += 1;
      table[team1Id].points += 3;
    } else if (team1Score < team2Score) {
      table[team2Id].won += 1;
      table[team1Id].lost += 1;
      table[team2Id].points += 3;
    } else {
      table[team1Id].draw += 1;
      table[team2Id].draw += 1;
      table[team1Id].points += 1;
      table[team2Id].points += 1;
    }
  });

  const sorted = Object.values(table).sort((a, b) => b.points - a.points);
  setStandings(sorted);
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏆 14-16 Yaş Gençler Turnuvası</Text>
      <Text style={styles.subtitle}>📅 Turnuva 15 Temmuz'da başlıyor. Katılım ücretsiz. Finalde sürpriz ödüller sizi bekliyor!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Bilgi Al', 'Form gösterilecek')}>
          <Text style={styles.buttonText}>📩 Bilgi Al / Başvur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Takım Oluştur', 'Modal açılacak')}>
          <Text style={styles.buttonText}>🛡 Takım Oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Takıma Katıl', 'Modal açılacak')}>
          <Text style={styles.buttonText}>👥 Takıma Katıl</Text>
        </TouchableOpacity>
        {currentTeamId && (
          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Takımdan Ayrıl', 'Modal açılacak')}>
            <Text style={styles.buttonText}>🚪 Takımdan Ayrıl</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>⚽ Katılan Takımlar</Text>
      {teams.map((team) => (
        <View key={team.id} style={styles.card}>
          <Text style={styles.cardText}>{team.name}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>🗓️ Maç Programı</Text>
      {matches.map((match) => (
        <View key={match.id} style={styles.card}>
          <Text style={styles.cardText}>{match.matchDate.slice(0, 16).replace('T', ' ')} - {match.team1?.name} vs {match.team2?.name} @ {match.fieldName}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>🏅 Puan Durumu</Text>
      {standings.map((team, index) => (
        <Text key={team.teamId} style={styles.standingText}>
          {index + 1}. {team.teamName} - {team.points} Puan (O:{team.played} G:{team.won} B:{team.draw} M:{team.lost})
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  button: { backgroundColor: '#1976d2', padding: 10, borderRadius: 8, margin: 4 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  card: { backgroundColor: '#e0f2f1', padding: 10, borderRadius: 8, marginBottom: 8 },
  cardText: { fontSize: 16 },
  standingText: { fontSize: 15, paddingVertical: 4 }
});

export default TurnuvaScreen;

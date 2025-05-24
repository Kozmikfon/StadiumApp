import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import TournamentMatchModal from '../../components/TournamentMatchModal';
import LeaveTeamModal from '../../components/LeaveTeamModal';
import JoinTeamModal from '../../components/JoinTeamModal';
import CreateTeamModal from '../../components/CreateTeamModal';


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
}

const API_URL = 'http://10.0.2.2:5275/api';

const TurnuvaScreen = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  //components
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
const [showJoinTeamModal, setShowJoinTeamModal] = useState(false);
const [showLeaveTeamModal, setShowLeaveTeamModal] = useState(false);
const [showMatchModal, setShowMatchModal] = useState(false);


  const fetchData = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const decoded: any = jwtDecode(token);
    const userId = decoded.userId;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const playerRes = await axios.get(`${API_URL}/players/byUser/${userId}`, config);
    setPlayerId(playerRes.data.id);
    setCurrentTeamId(playerRes.data.teamId || null);

    const teamRes = await axios.get(`${API_URL}/Teams/tournament-teams`, config);
    setTeams(teamRes.data);

    const matchRes = await axios.get(`${API_URL}/Matches/tournament-matches`, config);
    setMatches(matchRes.data);

    calculateStandings(matchRes.data); // ✅ Burada çağır
  } catch (error: any) {
    console.error("Veri alınırken hata:", error.response?.data || error.message);
  }
};


  const calculateStandings = (matchList: Match[]) => {
  const table: { [teamId: number]: Standing } = {};

  matchList.forEach(match => {
    if (!match.team1?.id || !match.team2?.id) {
      console.warn("Eksik takım bilgisi:", match);
      return;
    }

    const team1Id = match.team1.id;
    const team2Id = match.team2.id;
    const team1Score = Math.floor(Math.random() * 4);
    const team2Score = Math.floor(Math.random() * 4);

    [team1Id, team2Id].forEach(teamId => {
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


  useEffect(() => {
    fetchData();
  }, []);

  return (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>🏆 14-16 Yaş Gençler Turnuvası</Text>
    <Text style={styles.subtitle}>📅 15 Temmuz'da başlıyor. Katılım ücretsiz!</Text>

    {/* Butonlar */}
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.button} onPress={() => setShowInfoModal(true)}>
        <Text style={styles.buttonText}>📩 Bilgi Al</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setShowCreateTeamModal(true)}>
        <Text style={styles.buttonText}>🛡 Takım Oluştur</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setShowJoinTeamModal(true)}>
        <Text style={styles.buttonText}>👥 Takıma Katıl</Text>
      </TouchableOpacity>

      {currentTeamId && (
        <TouchableOpacity style={styles.button} onPress={() => setShowLeaveTeamModal(true)}>
          <Text style={styles.buttonText}>🚪 Takımdan Ayrıl</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={() => setShowMatchModal(true)}>
        <Text style={styles.buttonText}>➕ Maç Oluştur</Text>
      </TouchableOpacity>
    </View>

    {/* TAKIMLAR */}
    <Text style={styles.sectionTitle}>⚽ Katılan Takımlar</Text>
    {teams.map(team => (
      <View key={team.id} style={styles.card}>
        <Text>{team.name}</Text>
      </View>
    ))}

    {/* MAÇLAR */}
    <Text style={styles.sectionTitle}>🗓️ Maç Programı</Text>
    {matches.map(match => (
      <View key={match.id} style={styles.card}>
        <Text>
          {match.matchDate.slice(0, 16).replace('T', ' ')} - {match.team1.name} vs {match.team2.name} @ {match.fieldName}
        </Text>
      </View>
    ))}

    {/* PUAN DURUMU */}
    <Text style={styles.sectionTitle}>🏅 Puan Durumu</Text>
    {standings.map((team, index) => (
      <Text key={team.teamId} style={styles.standingText}>
        {index + 1}. {team.teamName} | O:{team.played} G:{team.won} B:{team.draw} M:{team.lost} - {team.points} P
      </Text>
    ))}

    {/* BİLGİ AL MODALI */}
    <Modal visible={showInfoModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Bilgi Talep Formu</Text>
          <TextInput placeholder="Ad Soyad" style={styles.input} />
          <TextInput placeholder="E-posta" keyboardType="email-address" style={styles.input} />
          <TextInput placeholder="Mesaj..." multiline numberOfLines={4} style={[styles.input, { height: 80 }]} />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => { Alert.alert('✅ Gönderildi!'); setShowInfoModal(false); }}>
              <Text style={styles.modalButtonText}>Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowInfoModal(false)}>
              <Text style={styles.modalButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* DİĞER MODALLAR */}
    {showCreateTeamModal && playerId !== null && (
      <CreateTeamModal
        visible={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        playerId={playerId}
        onTeamCreated={fetchData}
      />
    )}

    {showJoinTeamModal && playerId !== null && (
      <JoinTeamModal
        visible={showJoinTeamModal}
        onClose={() => setShowJoinTeamModal(false)}
        playerId={playerId}
        currentTeamId={currentTeamId}
        onTeamJoined={fetchData}
      />
    )}

    {showLeaveTeamModal && playerId !== null && (
      <LeaveTeamModal
        visible={showLeaveTeamModal}
        onClose={() => setShowLeaveTeamModal(false)}
        playerId={playerId}
        onTeamLeft={fetchData}
      />
    )}

    {showMatchModal && (
      <TournamentMatchModal
        visible={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        onMatchCreated={fetchData}
      />
    )}
  </ScrollView>
);

}
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { textAlign: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 12 },
  button: { backgroundColor: '#1e88e5', padding: 10, borderRadius: 8, margin: 4 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  card: { backgroundColor: '#e0f7fa', padding: 10, borderRadius: 6, marginVertical: 4 },
  standingText: { fontSize: 14, marginVertical: 2 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '85%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginVertical: 5 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalButtonText: { color: '#1976d2', fontWeight: 'bold' },
});

export default TurnuvaScreen;

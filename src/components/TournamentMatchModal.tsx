// components/TournamentMatchModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
interface Team {
  id: number;
  name: string;
}

const API_URL = 'http://10.0.2.2:5275/api';

interface Props {
  visible: boolean;
  onClose: () => void;
  onMatchCreated: () => void;
}

const TournamentMatchModal = ({ visible, onClose, onMatchCreated }: Props) => {
  const [fieldName, setFieldName] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [team1Id, setTeam1Id] = useState<number | null>(null);
  const [team2Id, setTeam2Id] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get(`${API_URL}/Teams/tournament-teams`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTeams(res.data);

    // Token’dan gelen oyuncunun takımı (kaptan olan takım1 olacak)
    const decoded: any = jwtDecode(token!);
    const userId = decoded.userId;
    const playerRes = await axios.get(`${API_URL}/players/byUser/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTeam1Id(playerRes.data.teamId);
  };

  const handleCreate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/Matches`, {
        fieldName,
        matchDate,
        team1Id,
        team2Id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Maç oluşturuldu!');
      setFieldName('');
      setMatchDate('');
      setTeam2Id(null);
      onMatchCreated();
      onClose();
    } catch (error) {
      Alert.alert('Hata', 'Maç oluşturulamadı.');
    }
  };

  useEffect(() => {
    if (visible) fetchTeams();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Maç Oluştur</Text>

          <TextInput
            placeholder="Saha Adı"
            value={fieldName}
            onChangeText={setFieldName}
            style={styles.input}
          />
          <TextInput
            placeholder="Tarih (YYYY-MM-DD HH:MM)"
            value={matchDate}
            onChangeText={setMatchDate}
            style={styles.input}
          />
          <Text style={{ marginVertical: 5 }}>Rakip Takım:</Text>
          {teams.filter(t => t.id !== team1Id).map((team: any) => (
            <TouchableOpacity
              key={team.id}
              onPress={() => setTeam2Id(team.id)}
              style={[styles.teamOption, team.id === team2Id && styles.selectedTeam]}
            >
              <Text>{team.name}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={handleCreate} style={styles.button}>
            <Text style={styles.buttonText}>Maçı Oluştur</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TournamentMatchModal;

import { jwtDecode } from 'jwt-decode'; // yukarı ekle

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#4caf50', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  cancelButton: { marginTop: 10, alignItems: 'center' },
  cancelText: { color: '#666', fontWeight: 'bold' },
  teamOption: {
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    marginBottom: 6
  },
  selectedTeam: {
    backgroundColor: '#90caf9',
  },
});

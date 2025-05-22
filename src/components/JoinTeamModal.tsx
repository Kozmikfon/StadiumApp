// components/JoinTeamModal.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5275/api';

interface Team {
  id: number;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  playerId: number;
  currentTeamId: number | null;
  onTeamJoined: () => void;
}

const JoinTeamModal = ({ visible, onClose, playerId, currentTeamId, onTeamJoined }: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/Teams/tournament-teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data);
    } catch (error) {
      Alert.alert('Hata', 'Takımlar alınamadı.');
    }
  };

  const handleJoinTeam = async (teamId: number) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/TeamMembers`, {
        playerId,
        teamId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Başarılı', 'Takıma katıldınız.');
      onTeamJoined();
      onClose();
    } catch (error) {
      Alert.alert('Hata', 'Takıma katılamadınız.');
    }
  };

  useEffect(() => {
    if (visible) {
      fetchTeams();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Takıma Katıl</Text>
          <FlatList
            data={teams.filter(t => t.id !== currentTeamId)} // aynı takımı filtrele
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.teamItem} onPress={() => handleJoinTeam(item.id)}>
                <Text style={styles.teamText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: '#ccc' }]}>
            <Text style={[styles.buttonText, { color: '#000' }]}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default JoinTeamModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modal: { width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: '80%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  teamItem: { padding: 10, backgroundColor: '#e3f2fd', borderRadius: 6, marginBottom: 8 },
  teamText: { fontSize: 16 },
  button: { marginTop: 10, padding: 10, borderRadius: 6, alignItems: 'center' },
  buttonText: { fontWeight: 'bold' }
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const PlayerList = ({ navigation }: any) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:5275/api/Players');
        setPlayers(response.data);
        setFilteredPlayers(response.data); // ✅ ilk yüklemede tümünü göster
      } catch (error) {
        console.error('❌ Oyuncular alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const lower = searchText.toLowerCase();
    const filtered = players.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(lower)
    );
    setFilteredPlayers(filtered);
  }, [searchText, players]);

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tüm Oyuncular</Text>

      <TextInput
        placeholder="Oyuncu ara..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PlayerDetail', { player: item })}
            >
              <Text style={styles.playerName}>{item.firstName} {item.lastName}</Text>
              <Text>Pozisyon: {item.position || 'Belirtilmemiş'}</Text>
              <Text>Skill Level: {item.skillLevel || '-'}</Text>
              <Text>Rating: {item.rating || '-'}</Text>
              <Text>Takım: {item.teamName ?? "Takımsız"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.offerButton}
              onPress={() => navigation.navigate('SendOffer', { receiverId: item.id })}
            >
              <Text style={styles.offerButtonText}>➕ Teklif Gönder</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  searchInput: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15
  },
  playerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  offerButton: {
    marginTop: 10,
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  offerButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default PlayerList;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const MyMatchesScreen = ({ navigation }: any) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyMatches = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        const userId = decoded.userId;

        // 1️⃣ Oyuncunun takımı
        const playerRes = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const myTeamId = playerRes.data.teamId;

        // 2️⃣ Tüm maçları getir
        const matchRes = await axios.get(`http://10.0.2.2:5275/api/Matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 3️⃣ Filtrele (team1 benim takımım)
        const filtered = matchRes.data.filter((m: any) => m.team1Id === myTeamId);
        setMatches(filtered);
      } catch (err) {
        console.error('❌ Maçlar alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMatches();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Maçlarım</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.teamText}>{item.team1Name} vs {item.team2Name}</Text>
            <Text>Saha: {item.fieldName}</Text>
            <Text>Tarih: {new Date(item.matchDate).toLocaleString()}</Text>

            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
            >
              <Text style={styles.detailButtonText}>📄 Detay</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Henüz maçınız yok.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  teamText: { fontSize: 16, fontWeight: 'bold' },
  detailButton: {
    marginTop: 10,
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  detailButtonText: { color: 'white', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 30 }
});

export default MyMatchesScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

type Match = {
  id: number;
  team1Id: number;
  team2Id: number;
  team1Name: string;
  team2Name: string;
  fieldName: string;
  matchDate: string;
};

const MyMatchesScreen = () => {
  const [matches, setMatches] = useState<Match[]>([]);

  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error("Token bulunamadı");

        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        // 1. Kullanıcının takım ID'sini al
        const playerRes = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`);
        const player = playerRes.data;

        if (!player.teamId) {
          setTeamId(null);
          setMatches([]);
          setLoading(false);
          return;
        }

        setTeamId(player.teamId);

        // 2. Tüm maçları getir
        const matchRes = await axios.get("http://10.0.2.2:5275/api/Matches");
        const allMatches = matchRes.data;

        // 3. Takıma ait maçları filtrele
        const filtered = allMatches.filter(
          (match: any) => match.team1Id === player.teamId || match.team2Id === player.teamId
        );

        setMatches(filtered);
      } catch (err) {
        console.error("❌ Maçlar alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />;
  }

  if (!teamId) {
    return <Text style={styles.warning}>⚠️ Herhangi bir takıma katılmadığınız için maç bulunamadı.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Maçlarım</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.matchCard}>
            <Text style={styles.matchText}>🏆 {item.team1Name} vs {item.team2Name}</Text>
            <Text style={styles.matchText}>📍 Saha: {item.fieldName}</Text>
            <Text style={styles.matchText}>📅 Tarih: {new Date(item.matchDate).toLocaleDateString('tr-TR')}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  matchCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  matchText: {
    fontSize: 16,
    marginBottom: 4,
  },
  warning: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default MyMatchesScreen;
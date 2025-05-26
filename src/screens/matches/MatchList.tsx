import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useIsFocused, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const MatchList = ({ navigation }: any) => {
  const route = useRoute<any>();
  const { filter, refresh } = route.params || {};
  const isFocused = useIsFocused();

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [filter, refresh, isFocused]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://10.0.2.2:5275/api/Matches');
      let filteredMatches = response.data;

      const matchesWithCounts = await Promise.all(
        filteredMatches.map(async (match: any) => {
          try {
            const countRes = await axios.get(`http://10.0.2.2:5275/api/Offers/count-accepted/${match.id}`);
            return { ...match, acceptedCount: countRes.data };
          } catch {
            return { ...match, acceptedCount: 0 };
          }
        })
      );

      if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filteredMatches = matchesWithCounts.filter((m: any) =>
          new Date(m.matchDate).toISOString().startsWith(today)
        );
      } else if (filter === 'week') {
        const today = new Date();
        const weekEnd = new Date();
        weekEnd.setDate(today.getDate() + 7);

        filteredMatches = matchesWithCounts.filter((m: any) => {
          const matchDate = new Date(m.matchDate);
          return matchDate >= today && matchDate <= weekEnd;
        });
      } else {
        filteredMatches = matchesWithCounts;
      }

      setMatches(filteredMatches);
    } catch (error) {
      console.error('❌ Maçlar alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (teamId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      const playerId = decoded.playerId;

      await axios.post('http://10.0.2.2:5275/api/TeamMembers', {
        teamId,
        playerId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Başarılı", "Takıma katıldınız!");
      navigation.replace('PlayerProfile');

    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        Alert.alert("⚠️ Uyarı", error.response.data);
      } else {
        Alert.alert("❌ Hata", "Takıma katılamadınız.");
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 30 }} />;
  }

  // ... önceki import'lar aynı

return (
  <View style={styles.container}>
    <Text style={styles.title}>📅 Tüm Maçlar</Text>

    <View style={styles.buttonGroup}>
      <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('CreateMatch')}>
        <Text style={styles.buttonText}>➕ Maç Oluştur</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('MyMatches')}>
        <Text style={styles.buttonText}>📋 Maçlarım</Text>
      </TouchableOpacity>
    </View>

    {matches.length === 0 ? (
      <Text style={styles.empty}>Henüz maç bulunamadı.</Text>
    ) : (
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isFull = item.acceptedCount >= 14;
          return (
            <View style={[styles.card, isFull && styles.cardFull]}>
              <TouchableOpacity
                onPress={() =>
                  isFull
                    ? Alert.alert("Bu maç dolu", "Maç 14 oyuncuya ulaştı.")
                    : navigation.navigate('MatchDetail', { matchId: item.id })
                }
              >
                <Text style={styles.matchTeams}>{item.team1Name} vs {item.team2Name}</Text>
                <Text style={styles.field}>📍 {item.fieldName}</Text>
                <Text style={styles.date}>
                  📅 {new Date(item.matchDate).toLocaleDateString()} - 🕓 {new Date(item.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={[styles.count, isFull ? styles.full : styles.available]}>
                  {item.acceptedCount}/14 Oyuncu {isFull ? '🛑 DOLU' : ''}
                </Text>
              </TouchableOpacity>

              {!isFull && (
                <TouchableOpacity
                  style={styles.offerButton}
                  onPress={() => navigation.navigate('SendOffer', { matchId: item.id })}
                >
                  <Text style={styles.offerButtonText}>➕ Teklif Gönder</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    )}
  </View>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: '#388E3C',
    padding: 12,
    borderRadius: 8,
  },
  buttonSecondary: {
    backgroundColor: '#1976D2',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: 'gray',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f1f8e9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  cardFull: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#D32F2F',
  },
  matchTeams: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  field: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  full: {
    color: 'red',
  },
  available: {
    color: 'green',
  },
  offerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
  },
  offerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default MatchList;

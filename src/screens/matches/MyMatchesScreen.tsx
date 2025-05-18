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
  const [acceptedCounts, setAcceptedCounts] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [filter, refresh, isFocused]);

  const fetchMatches = async () => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem('token');
    const decoded: any = jwtDecode(token || '');
    const playerId = decoded.playerId;

    const response = await axios.get(
      `http://10.0.2.2:5275/api/Matches/byPlayer/${playerId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    let filteredMatches = response.data;

    // 🔹 Tarih filtrelemesi
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filteredMatches = filteredMatches.filter((m: any) =>
        new Date(m.matchDate).toISOString().startsWith(today)
      );
    } else if (filter === 'week') {
      const today = new Date();
      const weekEnd = new Date();
      weekEnd.setDate(today.getDate() + 7);

      filteredMatches = filteredMatches.filter((m: any) => {
        const matchDate = new Date(m.matchDate);
        return matchDate >= today && matchDate <= weekEnd;
      });
    }

    setMatches(filteredMatches);

    // 🔹 Oyuncu sayısını getir
    for (const match of filteredMatches) {
      const countRes = await axios.get(`http://10.0.2.2:5275/api/Offers/count-accepted/${match.id}`);
      setAcceptedCounts((prev) => ({ ...prev, [match.id]: countRes.data }));
    }

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

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>📅 Maçlar</Text>
        <Button title="➕ Maç Oluştur" onPress={() => navigation.navigate('CreateMatch')} />
      </View>
      <Button title="🛡 Takım Oluştur" color="#6A1B9A" onPress={() => navigation.navigate('CreateTeam')} />
    
      {matches.length === 0 ? (
        <Text style={styles.empty}>Henüz maç bulunamadı.</Text>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const accepted = acceptedCounts[item.id] || 0;
            const remaining = 14 - accepted;

            return (
              <View style={styles.card}>
                <Text style={styles.matchTeams}>{item.team1Name} vs {item.team2Name}</Text>
                <Text style={styles.field}>Saha: {item.fieldName}</Text>
                <Text style={styles.date}>
                  Tarih: {new Date(item.matchDate).toLocaleDateString()} - {new Date(item.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.status}>🧍 Oyuncu: {accepted} / 14</Text>
                <Text style={styles.status}>🎯 Kalan: {remaining} kişi</Text>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: remaining > 0 ? '#2E7D32' : 'gray' }]}
                  disabled={remaining === 0}
                  onPress={() => navigation.navigate('SendOffer', { matchId: item.id })}
                >
                  <Text style={styles.buttonText}>{remaining === 0 ? '🛑 Maç Dolu' : '➕ Teklif Gönder'}</Text>
                </TouchableOpacity>
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
    backgroundColor: '#fff'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: 'gray'
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  matchTeams: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  field: {
    fontSize: 14,
    color: '#555',
    marginTop: 5
  },
  date: {
    fontSize: 14,
    color: '#333',
    marginTop: 3
  },
  status: {
    marginTop: 5,
    fontSize: 14,
    color: '#000'
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default MatchList;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const TopPlayersScreen = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://10.0.2.2:5275/api/Players/top-players')
      .then(res => setPlayers(res.data))
      .catch(err => console.error('❌ Oyuncular alınamadı:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#6A1B9A" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 En İyi Oyuncular</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.name}>{item.fullName}</Text>
            <Text>📈 Rating: {item.rating}</Text>
            <Text>🎮 Maç Sayısı: {item.matchCount}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Hiç oyuncu bulunamadı.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#e3f2fd',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10
  },
  rank: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1976D2'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic'
  }
});

export default TopPlayersScreen;

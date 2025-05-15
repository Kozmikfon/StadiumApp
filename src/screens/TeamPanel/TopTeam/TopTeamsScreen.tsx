import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/props/types';

const TopTeamsScreen = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    const fetchTopTeams = async () => {
      try {
        const res = await axios.get('http://10.0.2.2:5275/api/Leaderboard/top-teams');
        setTeams(res.data);
      } catch (err) {
        console.error('❌ Takımlar alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTeams();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 En Çok Maç Yapan Takımlar</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.count}>🎮 {item.matchCount} maç</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Henüz takım verisi yok.</Text>}
      />
      <Button
  title="🏅 En İyi Oyuncular"
  onPress={() => navigation.navigate('TopPlayers')}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rank: { fontSize: 18, fontWeight: 'bold', color: '#FB8C00' },
  name: { fontSize: 16, fontWeight: '600' },
  count: { fontSize: 14, color: '#555' },
  empty: { textAlign: 'center', marginTop: 20 }
});

export default TopTeamsScreen;

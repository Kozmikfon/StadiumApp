import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const TeamDetailScreen = () => {
  const route = useRoute<any>();
  const { teamId } = route.params;

  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamRes = await axios.get(`http://10.0.2.2:5275/api/Teams/details/${teamId}`);
        setTeam(teamRes.data);

        const playersRes = await axios.get(`http://10.0.2.2:5275/api/Teams/${teamId}/players`);
        setPlayers(playersRes.data);
      } catch (error) {
        console.error('❌ Veri alınamadı:', error);
        Alert.alert('Hata', 'Takım bilgisi veya oyuncular yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6A1B9A" />
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>❌ Takım bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>🏷 {team.name}</Text>
        <Text style={styles.subTitle}>Takım Bilgileri</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🧑‍✈️ Kaptan</Text>
        <Text style={styles.value}>{team.captainName}</Text>

        <Text style={styles.label}>👥 Üye Sayısı</Text>
        <Text style={styles.value}>{team.memberCount}</Text>

        <Text style={styles.label}>⚽ Oynanan Maç</Text>
        <Text style={styles.value}>{team.totalMatches}</Text>
      </View>

      <Text style={styles.sectionTitle}>👥 Takım Üyeleri</Text>

      {players.length > 0 ? (
        players.map((player: any) => (
          <View key={player.id} style={styles.memberCard}>
            <Text style={styles.memberName}>🧍 {player.firstName} {player.lastName}</Text>
            <Text style={styles.memberPosition}>🧭 {player.position || 'Pozisyon belirtilmemiş'}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Takımda henüz oyuncu yok.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e3f2fd',
  },
  headerBox: {
    backgroundColor: '#6A1B9A',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subTitle: {
    fontSize: 14,
    color: '#f3e5f5',
    marginTop: 6,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#607d8b',
    fontWeight: 'bold',
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#263238',
    fontWeight: '500',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#37474f',
  },
  memberCard: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
  },
  memberPosition: {
    fontSize: 14,
    color: '#607d8b',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  warning: {
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});

export default TeamDetailScreen;

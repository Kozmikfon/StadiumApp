import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const TeamDetailScreen = () => {
  const route = useRoute<any>();
  const { teamId } = route.params;

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`http://10.0.2.2:5275/api/Teams/details/${teamId}`);
        setTeam(res.data);
      } catch (error) {
        console.error("❌ Takım bilgisi alınamadı:", error);
        Alert.alert("Hata", "Takım bilgisi yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#6A1B9A" style={{ marginTop: 40 }} />;
  }

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>❌ Takım bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏷 Takım Detayı</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Takım Adı:</Text>
        <Text>{team.name}</Text>

        <Text style={styles.label}>Kaptan:</Text>
        <Text>{team.captainName}</Text>

        <Text style={styles.label}>Üye Sayısı:</Text>
        <Text>{team.memberCount}</Text>

        <Text style={styles.label}>Oynanan Maç:</Text>
        <Text>{team.totalMatches}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10
  },
  warning: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16
  }
});

export default TeamDetailScreen;

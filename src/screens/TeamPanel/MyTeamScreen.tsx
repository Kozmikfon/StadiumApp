import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const MyTeamScreen = ({ navigation }: any) => {
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token bulunamadı');

        const decoded: any = jwtDecode(token);
        const userId = decoded.userId || decoded.nameid || decoded.sub;

        if (!userId) throw new Error('userId token içinde bulunamadı');

        // 🟢 userId'den playerId çekiyoruz
        const playerRes = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`);
        const pid = playerRes.data.id;

        setPlayerId(pid);

        const teamRes = await axios.get(`http://10.0.2.2:5275/api/Teams/profile/${pid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTeamInfo(teamRes.data);
      } catch (error: any) {
        console.error("❌ Takım bilgisi alınamadı:", error.message || error);
        Alert.alert("Hata", "Takım bilgisi yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleLeaveTeam = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      const userId = decoded.userId || decoded.nameid || decoded.sub;

      const playerRes = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`);
      const pid = playerRes.data.id;

      await axios.delete(`http://10.0.2.2:5275/api/TeamMembers/leave/${pid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("✅ Ayrıldınız", "Takımdan çıkış başarılı.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("❌ Hata", "Takımdan ayrılamadınız.");
      console.error(err);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 50 }} />;
  }

  if (!teamInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>❌ Herhangi bir takıma ait değilsiniz.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Takım Bilgileri</Text>

      <View style={styles.card}>
        <Text style={styles.label}>🏷 Takım Adı:</Text>
        <Text>{teamInfo.name}</Text>

        <Text style={styles.label}>🧑‍✈️ Kaptan:</Text>
        <Text>{teamInfo.captainName}</Text>

        <Text style={styles.label}>👥 Üye Sayısı:</Text>
        <Text>{teamInfo.memberCount}</Text>

        <Text style={styles.label}>🎮 Oynanan Maçlar:</Text>
        <Text>{teamInfo.totalMatches}</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="❌ Takımdan Ayrıl" color="#F44336" onPress={handleLeaveTeam} />

        {Number(playerId) === Number(teamInfo.captainId) && (
          <Button
            title="🧑‍✈️ Kaptanı Değiştir"
            color="#6A1B9A"
            onPress={() => navigation.navigate('ChangeCaptain')}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#f0f4c3',
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

export default MyTeamScreen;

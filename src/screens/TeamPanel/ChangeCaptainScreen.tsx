import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const ChangeCaptainScreen = ({ navigation }: any) => {
  const [members, setMembers] = useState<any[]>([]);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [currentCaptainId, setCurrentCaptainId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchTeamAndMembers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');

      const rawPlayerId = decoded.playerId;
      const playerId = Array.isArray(rawPlayerId)
        ? Number(rawPlayerId[0])
        : Number(rawPlayerId);

      // 1️⃣ Takım bilgisi getir
      const res = await axios.get(`http://10.0.2.2:5275/api/Teams/profile/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTeamId(res.data.id);
      setCurrentCaptainId(res.data.captainId);

      // 2️⃣ Oyuncu listesini getir
      const playersRes = await axios.get(`http://10.0.2.2:5275/api/Teams/${res.data.id}/players`);
      setMembers(playersRes.data);
    } catch (err) {
      console.error("❌ Takım ya da oyuncular alınamadı:", err);
      Alert.alert("Hata", "Bilgiler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  fetchTeamAndMembers();
}, []);


  const handleChangeCaptain = async (newCaptainId: number) => {
    if (newCaptainId === currentCaptainId) {
      Alert.alert("⚠️ Zaten bu oyuncu kaptan.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://10.0.2.2:5275/api/Teams/assign-captain?teamId=${teamId}&newCaptainId=${newCaptainId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // 🟢 State'i güncelle
      setCurrentCaptainId(newCaptainId);

      Alert.alert("✅ Kaptan başarıyla değiştirildi");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Kaptan değiştirilemedi:", err);
      Alert.alert("Hata", "Kaptan değiştirilemedi.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#6A1B9A" style={{ marginTop: 50 }} />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>🧑‍✈️ Yeni Kaptanı Seç</Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.id === currentCaptainId && styles.currentCaptain]}
            onPress={() => handleChangeCaptain(item.id)}
          >
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            <Text>Pozisyon: {item.position}</Text>
            {item.id === currentCaptainId && (
              <Text style={styles.captainText}>🎖 Mevcut Kaptan</Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Üye bulunamadı.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10
  },
  currentCaptain: {
    borderColor: '#6A1B9A',
    borderWidth: 2,
    backgroundColor: '#f3e5f5'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  captainText: {
    marginTop: 4,
    fontStyle: 'italic',
    color: '#6A1B9A',
    fontWeight: '600'
  }
});

export default ChangeCaptainScreen;

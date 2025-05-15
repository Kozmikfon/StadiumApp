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
    const fetchTeam = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        const playerId = decoded.playerId;

        const res = await axios.get(`http://10.0.2.2:5275/api/Teams/profile/${playerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTeamId(res.data.id);
        setCurrentCaptainId(res.data.captainId);
        setMembers(res.data.members); // DTO'da üyeler zaten varsa buradan gelir
      } catch (err) {
        console.error("❌ Takım verisi alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const handleChangeCaptain = async (newCaptainId: number) => {
    if (newCaptainId === currentCaptainId) {
      Alert.alert("⚠️ Zaten bu oyuncu kaptan.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://10.0.2.2:5275/api/Teams/${teamId}`, {
        captainId: newCaptainId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("✅ Kaptan değiştirildi");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Değişim hatası:", err);
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
            style={styles.card}
            onPress={() => handleChangeCaptain(item.id)}
          >
            <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
            <Text>Pozisyon: {item.position}</Text>
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
  name: {
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ChangeCaptainScreen;

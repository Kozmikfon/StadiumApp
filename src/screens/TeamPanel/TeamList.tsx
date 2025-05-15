import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const TeamList = ({ navigation }: any) => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTeamsAndPlayer = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        const userId = decoded.userId;

        // 🎯 Oyuncu bilgisi
        const playerRes = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`);
        setPlayerId(playerRes.data.id);

        // 🎯 Takım listesi
        const response = await axios.get('http://10.0.2.2:5275/api/Teams');
        setTeams(response.data);
      } catch (error) {
        console.error('❌ Takım veya oyuncu bilgisi alınamadı:', error);
        Alert.alert("Hata", "Bilgiler alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndPlayer();
  }, []);

  const handleJoin = async (teamId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');

      // 🎯 Zaten katıldı mı kontrol
      const membersRes = await axios.get(`http://10.0.2.2:5275/api/TeamMembers`);
      const alreadyInTeam = membersRes.data.some((tm: any) => tm.playerId === playerId);

      if (alreadyInTeam) {
        Alert.alert("⚠️ Zaten bir takıma aitsiniz.");
        return;
      }

      // 🎯 Katılım isteği gönder
      await axios.post(
        'http://10.0.2.2:5275/api/TeamMembers',
        { teamId, playerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("✅ Başarılı", "Takıma katıldınız!");
      navigation.replace('PlayerProfile');

    } catch (error: any) {
      console.error("❌ Katılım hatası:", error);
      Alert.alert("Hata", "Takıma katılamadınız.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tüm Takımlar</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.teamCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
            >
              <Text style={styles.teamName}>🏆 {item.name}</Text>
              <Text>Kaptan: {item.captain ? `${item.captain.firstName} ${item.captain.lastName}` : 'Belirtilmemiş'}</Text>
              <Text>Oyuncu Sayısı: {item.players?.length ?? 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoin(item.id)}
            >
              <Text style={styles.joinButtonText}>Takıma Katıl</Text>
            </TouchableOpacity>
           
          </View>
          
        )}
      />
       <Button title="📨 Takımım" color="#FFA000" onPress={() => navigation.navigate('MyTeam')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  teamCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  joinButton: {
    marginTop: 10,
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default TeamList;

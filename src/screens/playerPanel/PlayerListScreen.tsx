import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const PlayerList = ({ navigation }: any) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:5275/api/Players');
        setPlayers(response.data);
      } catch (error) {
        console.error('❌ Oyuncular alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleSendOffer = async (receiverId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      const senderUserId = decoded.userId;

      const senderResponse = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${senderUserId}`);
      const senderId = senderResponse.data.id;

      const matchId = 1; // 👈 Sabit maç ID, sonra seçimli yapılabilir

      const offerDto = {
        senderId,
        receiverId,
        matchId,
        status: "Beklemede"
      };

      await axios.post('http://10.0.2.2:5275/api/Offers', offerDto, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("✅ Teklif Gönderildi");

    } catch (error) {
      console.error("❌ Teklif gönderilemedi:", error);
      Alert.alert("Hata", "Teklif gönderilemedi.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tüm Oyuncular</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.playerCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PlayerDetail', { player: item })}
            >
              <Text style={styles.playerName}>{item.firstName} {item.lastName}</Text>
              <Text>Pozisyon: {item.position || 'Belirtilmemiş'}</Text>
              <Text>Skill Level: {item.skillLevel || '-'}</Text>
              <Text>Rating: {item.rating || '-'}</Text>
              <Text>Takım: {item.teamName ?? "Takımsız"}</Text>
            </TouchableOpacity>

           <TouchableOpacity
  style={styles.offerButton}
  onPress={() => navigation.navigate('SendOffer', { receiverId: item.id })}
>
  <Text style={styles.offerButtonText}>➕ Teklif Gönder</Text>
</TouchableOpacity>


          </View>
        )}
      />
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
  playerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  offerButton: {
    marginTop: 10,
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  offerButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default PlayerList;

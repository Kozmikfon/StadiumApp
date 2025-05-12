import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const MatchDetailScreen = () => {
  const route = useRoute<any>();
  const { matchId } = route.params;

  const [match, setMatch] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        setPlayerId(decoded.playerId);

        const matchRes = await axios.get(`http://10.0.2.2:5275/api/Matches/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const offersRes = await axios.get(`http://10.0.2.2:5275/api/Offers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMatch(matchRes.data);
        const filteredOffers = offersRes.data.filter((o: any) => o.matchId === matchId);
        setOffers(filteredOffers);
      } catch (error) {
        console.error("❌ Match detayları alınamadı:", error);
        Alert.alert("Hata", "Maç detayları yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [matchId]);

  const handleUpdateStatus = async (offerId: number, newStatus: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`http://10.0.2.2:5275/api/Offers/update-status/${offerId}`, `"${newStatus}"`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      Alert.alert("✅ Başarılı", `Teklif "${newStatus}" olarak güncellendi.`);
      // Listeyi güncelle
      const updated = offers.map(o =>
        o.id === offerId ? { ...o, status: newStatus } : o
      );
      setOffers(updated);
    } catch (error) {
      console.error("❌ Güncelleme hatası:", error);
      Alert.alert("Hata", "Teklif durumu güncellenemedi.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏟 Maç Detayı</Text>

      <View style={styles.card}>
        <Text><Text style={styles.label}>Saha:</Text> {match.fieldName}</Text>
        <Text><Text style={styles.label}>Tarih:</Text> {new Date(match.matchDate).toLocaleString()}</Text>
        <Text><Text style={styles.label}>Takım 1:</Text> {match.team1Name}</Text>
        <Text><Text style={styles.label}>Takım 2:</Text> {match.team2Name}</Text>
      </View>

      <Text style={[styles.title, { fontSize: 18 }]}>📨 Gelen Teklifler</Text>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.offerCard}>
            <Text>Gönderen Oyuncu ID: {item.senderId}</Text>
            <Text>Alıcı Oyuncu ID: {item.receiverId}</Text>
            <Text>Durum: {item.status}</Text>

            {item.status === "Beklemede" && item.receiverId === playerId && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: '#4CAF50' }]}
                  onPress={() => handleUpdateStatus(item.id, "Kabul Edildi")}
                >
                  <Text style={styles.statusText}>Kabul Et</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: '#F44336' }]}
                  onPress={() => handleUpdateStatus(item.id, "Reddedildi")}
                >
                  <Text style={styles.statusText}>Reddet</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Bu maça teklif gönderilmemiş.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  offerCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2
  },
  label: { fontWeight: 'bold' },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 10
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default MatchDetailScreen;

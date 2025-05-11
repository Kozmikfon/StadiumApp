import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const MyOffersScreen = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        const playerId = decoded.playerId;

        const response = await axios.get(`http://10.0.2.2:5275/api/Offers/byPlayer/${playerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOffers(response.data);
      } catch (err) {
        console.error("❌ Teklifler alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📨 Gelen Teklifler</Text>
      <FlatList
        data={offers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Gönderen Oyuncu ID: {item.senderId}</Text>
            <Text>Maç ID: {item.matchId}</Text>
            <Text>Durum: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Henüz teklif yok.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 }
});

export default MyOffersScreen;

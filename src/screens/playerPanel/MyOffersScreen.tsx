import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const MyOffersScreen = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchOffers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOffers();
    }, [])
  );

  const updateStatus = async (offerId: number, status: string) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.put(
        `http://10.0.2.2:5275/api/Offers/update-status/${offerId}`,
        `"${status}"`, // JSON string olarak gönder
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const updatedOffer = response.data;

      Alert.alert("✅ Başarılı", `Teklif ${status} olarak güncellendi`);

      // Güncellenen veriyi state içinde değiştir
      setOffers(prev =>
        prev.map(o => o.id === offerId ? updatedOffer : o)
      );

    } catch (error) {
      console.error("❌ Güncelleme hatası:", error);
      Alert.alert("Hata", "Durum güncellenemedi.");
    }
  };

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

            {item.status === 'Beklemede' && (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.acceptBtn} onPress={() => updateStatus(item.id, "Onaylandı")}>
                  <Text style={styles.btnText}>Onayla</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => updateStatus(item.id, "Reddedildi")}>
                  <Text style={styles.btnText}>Reddet</Text>
                </TouchableOpacity>
              </View>
            )}
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
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  acceptBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 5
  },
  rejectBtn: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 5
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default MyOffersScreen;

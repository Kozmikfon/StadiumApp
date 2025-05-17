import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const CaptainOffersScreen = ({ navigation }: any) => {
  const [captainOffers, setCaptainOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCaptainOffers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      const playerId = decoded.playerId;

      const res = await axios.get(`http://10.0.2.2:5275/api/Offers/byCaptain/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCaptainOffers(res.data);
    } catch (err) {
      console.error("❌ Kaptan teklifleri alınamadı:", err);
      Alert.alert("Hata", "Kaptan teklifleri getirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (offerId: number, status: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://10.0.2.2:5275/api/Offers/update-status/${offerId}`,
        { Status: status },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert("Başarılı", `Teklif ${translateStatus(status)} olarak güncellendi.`);
      fetchCaptainOffers();
    } catch (err) {
      console.error("❌ Durum güncellenemedi:", err);
      Alert.alert("Hata", "Teklif durumu güncellenemedi.");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCaptainOffers();
    });
    return unsubscribe;
  }, [navigation]);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Beklemede';
      case 'Accepted':
        return 'Onaylandı';
      case 'Rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 30 }} />;
  }

  return (
  <View style={styles.container}>
    <Text style={styles.title}>⚔️ Takımıma Gelen Maç Teklifleri</Text>

    <FlatList
      data={captainOffers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.label}>
            🎮 Gönderen Oyuncu: {item.sender?.firstName} {item.sender?.lastName}
          </Text>
          <Text style={styles.label}>
            📅 Maç Tarihi: {new Date(item.match?.matchDate).toLocaleDateString()}
          </Text>
          <Text style={styles.label}>📍 Saha: {item.match?.fieldName}</Text>

          <Text style={[styles.label, {
            color:
              item.status === 'Accepted' ? '#4CAF50' :
              item.status === 'Rejected' ? '#f44336' :
              '#FF9800'
          }]}>
            📨 Durum: {translateStatus(item.status)}
          </Text>

          {item.status === 'Pending' && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => updateStatus(item.id, 'Accepted')}
              >
                <Text style={styles.btnText}>Onayla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => updateStatus(item.id, 'Rejected')}
              >
                <Text style={styles.btnText}>Reddet</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('MatchDetail', { matchId: item.matchId })}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>📄 Maç Detayı</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>Takıma gelen maç teklifi bulunmamaktadır.</Text>
      }
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
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: { fontSize: 15, marginBottom: 4 },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic'
  },
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

export default CaptainOffersScreen;

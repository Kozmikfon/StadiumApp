import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const MyOffersScreen = ({ navigation }: any) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  //const navigation = useNavigation();
  const [captainOffers, setCaptainOffers] = useState<any[]>([]);

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
      console.error('❌ Teklifler alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOffers();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchOffers();
  }, []);

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

      Alert.alert('✅ Başarılı', `Teklif ${translateStatus(status)} olarak güncellendi`);
      await fetchOffers();
    } catch (error) {
      console.error('❌ Güncelleme hatası:', error);
      Alert.alert('Hata', 'Durum güncellenemedi.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 30 }} />;
  }

  const acceptedOffers = offers.filter(o => o.status === 'Accepted');
  const rejectedOffers = offers.filter(o => o.status === 'Rejected');
  const pendingOffers = offers.filter(o => o.status === 'Pending');

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>📨 Bekleyen Teklifler</Text>
<FlatList
  data={pendingOffers}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Text>Takım: {item.matchTeamName}</Text>
      <Text>Saha: {item.matchFieldName}</Text>
      <Text>Kaptan: {item.matchCaptainName}</Text>
      <Text>Durum: {translateStatus(item.status)}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => updateStatus(item.id, 'Accepted')}>
          <Text style={styles.btnText}>Onayla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => updateStatus(item.id, 'Rejected')}>
          <Text style={styles.btnText}>Reddet</Text>
        </TouchableOpacity>
      </View>

      {/* 📄 Detaya Git Butonu */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MatchDetail', { matchId: item.matchId })}
        style={{ marginTop: 8 }}
      >
        <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>📄 Maç Detayı</Text>
      </TouchableOpacity>
    </View>
  )}

  ListEmptyComponent={<Text style={styles.empty}>Henüz bekleyen teklif yok.</Text>}
/>

{/* ACCEPTED OFFERS */}
<Text style={styles.title}> Kabul Ettiklerim</Text>
<FlatList
  data={acceptedOffers}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    
    <View style={styles.card}>
      
      <Text style={styles.label}>📅 Maç: {new Date(item.matchDate).toLocaleDateString()}</Text>
      <Text style={styles.label}>📍 Saha: {item.fieldName}</Text>
      <Text style={styles.label}>🧑‍✈️ Kaptan: {item.captainName}</Text>
      <Text style={styles.label}>📨 Durum: {translateStatus(item.status)}</Text>
      <TouchableOpacity
  onPress={() => navigation.navigate('MatchDetail', { matchId: item.matchId })}
  style={{ marginTop: 8 }}
>
  <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>📄 Maç Detayı</Text>
</TouchableOpacity>


    </View>
    
  )}
  ListEmptyComponent={<Text style={styles.empty}>Hiçbir maçı kabul etmediniz.</Text>}
/>

{/* REJECTED OFFERS */}
<Text style={styles.title}> Reddettiklerim</Text>

<FlatList
  data={rejectedOffers}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>📅 Maç: {new Date(item.matchDate).toLocaleDateString()}</Text>
      <Text style={styles.label}>📍 Saha: {item.fieldName}</Text>
      <Text style={styles.label}>🧑‍✈️ Kaptan: {item.captainName}</Text>
      <Text style={styles.label}>📨 Durum: {translateStatus(item.status)}</Text>
      <TouchableOpacity
  onPress={() => navigation.navigate('MatchDetail', { matchId: item.matchId })}
  style={{ marginTop: 8 }}
>
  <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>📄 Maç Detayı</Text>
</TouchableOpacity>



    </View>
  )}
  ListEmptyComponent={<Text style={styles.empty}>Henüz reddettiğiniz teklif yok.</Text>}
/>
<Button title="🛡 Maça gelen teklifler" color="#6A1B9A" onPress={() => navigation.navigate('CaptainOffer')} />

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
  elevation: 3, // Android için gölge
  shadowColor: '#000', // iOS için
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},

  label: {
  fontSize: 15,
  marginBottom: 4
},

  empty: { textAlign: 'center', marginTop: 10, fontSize: 16 },
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

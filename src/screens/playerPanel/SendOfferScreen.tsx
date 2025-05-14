import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const SendOfferScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { receiverId } = route.params;

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<number>(0);
  const [senderId, setSenderId] = useState<number | null>(null);
  const [acceptedCount, setAcceptedCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        setSenderId(decoded.playerId);

        const matchRes = await axios.get('http://10.0.2.2:5275/api/Matches');
        setMatches(matchRes.data);
      } catch (err) {
        console.error('❌ Veriler alınamadı:', err);
        Alert.alert('Hata', 'Veriler alınırken sorun oluştu.');
      }
    };

    init();
  }, []);

    if (acceptedCount >= 14) {
  Alert.alert("⚠️ Uyarı", "Bu maç dolu. Başka maç seçin.");
  return;
    }

  const handleSendOffer = async () => {
    if (!senderId || !receiverId || selectedMatchId === 0) {
      Alert.alert('⚠️ Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    console.log("senderId:", senderId);
    console.log("receiverId:", receiverId);
    console.log("selectedMatchId:", selectedMatchId);


    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const offerDto = {
        senderId,
        receiverId,
        matchId: selectedMatchId,
      };

      await axios.post('http://10.0.2.2:5275/api/Offers', offerDto, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('✅ Başarılı', 'Teklif gönderildi.');
      navigation.goBack();
    } catch (err) {
      console.error('❌ Teklif gönderilemedi:', err);
      Alert.alert('Hata', 'Teklif gönderilirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  //maça cıkacak oyuncu sayısını al
  const fetchAcceptedCount = async () => {
  try {
    const res = await axios.get(`http://10.0.2.2:5275/api/Offers/count-accepted/${selectedMatchId}`);
    setAcceptedCount(res.data);
  } catch (err) {
    console.error("Teklif sayısı alınamadı:", err);
  }
};


  if (loading) {
    return <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Teklif Gönder</Text>
      <Text>👤 Alıcı Oyuncu ID: {receiverId}</Text>

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>📅 Maç Seçin:</Text>
      <Picker
        selectedValue={selectedMatchId}
        onValueChange={(value) => setSelectedMatchId(value)}
        style={{ backgroundColor: '#e0e0e0', marginVertical: 10 }}
      >
        <Picker.Item label="Bir maç seçin..." value={0} />
        {matches.map((match: any) => (
          <Picker.Item
            key={match.id}
            label={`#${match.id} - ${match.fieldName} (${new Date(match.matchDate).toLocaleDateString()})`}
            value={match.id}
          />
        ))}
      </Picker>

      <Button title="➕ Teklif Gönder" color="#2E7D32" onPress={handleSendOffer} />
      {acceptedCount >= 14 ? (
  <Text style={{ color: 'red', marginTop: 10 }}>🛑 Bu maç dolu</Text>
) : (
  <Button title="➕ Teklif Gönder" color="#2E7D32" onPress={handleSendOffer} />
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 }
});

export default SendOfferScreen;

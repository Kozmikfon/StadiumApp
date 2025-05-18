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
  const { receiverId, matchId: matchIdFromRoute } = route.params ?? {};

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<number>(matchIdFromRoute || 0);
  const [senderId, setSenderId] = useState<number | null>(null);
  const [acceptedCount, setAcceptedCount] = useState(0);

  const fetchAcceptedCount = async (matchId: number) => {
    try {
      const res = await axios.get(`http://10.0.2.2:5275/api/Offers/count-accepted/${matchId}`);
      setAcceptedCount(res.data);
    } catch (err) {
      console.error("❌ Teklif sayısı alınamadı:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert("Giriş yapmanız gerekiyor.");
          return;
        }

        const decoded: any = jwtDecode(token);
        setSenderId(Number(decoded.playerId));

        if (!matchIdFromRoute) {
          const matchRes = await axios.get('http://10.0.2.2:5275/api/Matches');
          setMatches(matchRes.data);
        } else {
          fetchAcceptedCount(matchIdFromRoute);
        }
      } catch (err) {
        console.error('❌ Veriler alınamadı:', err);
        Alert.alert('Hata', 'Veriler alınırken sorun oluştu.');
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (selectedMatchId !== 0) {
      fetchAcceptedCount(selectedMatchId);
    }
  }, [selectedMatchId]);

 const handleSendOffer = async () => {
  if (!senderId || selectedMatchId === 0) {
    Alert.alert('⚠️ Eksik Bilgi', 'Gönderen ya da maç bilgisi eksik.');
    return;
  }

  if (acceptedCount >= 14) {
    Alert.alert("⚠️ Uyarı", "Bu maç dolu. Başka maç seçin.");
    return;
  }

  try {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');

    const offerDto = {
      senderId,
      matchId: selectedMatchId,
      receiverId: receiverId !== undefined ? receiverId : null
    };

    console.log("🚀 Teklif DTO:", offerDto);

    await axios.post('http://10.0.2.2:5275/api/Offers', offerDto, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Alert.alert('✅ Başarılı', 'Teklif gönderildi.');
    navigation.goBack();

    } catch (err: any) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    console.log("❌ Hata Detayı:", {
      status,
      data
    });

    if (status === 400 || status === 409) {
      let message = "Bu oyuncuya veya maça zaten teklif gönderdiniz.";

      // Eğer backend'den string açıklama geldiyse onu göster:
      if (typeof data === 'string') {
        message = data;
      } else if (data?.message) {
        message = data.message;
      }

      Alert.alert("⚠️ Uyarı", message);
    } else {
      Alert.alert("Hata", "Teklif gönderilirken beklenmeyen bir hata oluştu.");
    }
  } else {
    Alert.alert("Hata", "Bilinmeyen bir hata oluştu.");
  }

  console.error('❌ Teklif gönderilemedi:', err);
}

 finally {
    setLoading(false);
  }
};


  if (loading) {
    return <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Teklif Gönder</Text>

      {receiverId && <Text>👤 Alıcı Oyuncu ID: {receiverId}</Text>}

      {!matchIdFromRoute && (
        <>
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
        </>
      )}

      <Text style={{ marginTop: 5, color: '#555', marginBottom: 10 }}>
        {acceptedCount}/14 oyuncu — {14 - acceptedCount} boş yer
      </Text>

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

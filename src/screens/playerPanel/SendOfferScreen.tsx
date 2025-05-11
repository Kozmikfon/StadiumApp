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
  const { receiverId } = route.params; // matchId artık dışarıdan değil, seçilecek

  const [loading, setLoading] = useState(false);
  const [senderId, setSenderId] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        setSenderId(decoded.playerId);

        const matchRes = await axios.get('http://10.0.2.2:5275/api/Matches');
        setMatches(matchRes.data);
      } catch (err) {
        Alert.alert('Hata', 'Veriler alınamadı.');
      }
    };
    init();
  }, []);

  const handleSendOffer = async () => {
    if (!senderId || !receiverId || !selectedMatchId) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      await axios.post('http://10.0.2.2:5275/api/Offers', {
        senderId,
        receiverId,
        matchId: selectedMatchId,
        status: 'Beklemede'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      Alert.alert('✅ Başarılı', 'Teklif gönderildi.');
      navigation.goBack();

    } catch (error) {
      console.error("Teklif gönderme hatası:", error);
      Alert.alert('❌ Hata', 'Teklif gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 30 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Teklif Gönder</Text>
      <Text>🎯 Alıcı Oyuncu ID: {receiverId}</Text>

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>📅 Maç Seçin:</Text>
      <Picker
        selectedValue={selectedMatchId}
        onValueChange={(value) => setSelectedMatchId(value)}
        style={{ backgroundColor: '#e0e0e0', marginVertical: 10 }}
      >
        <Picker.Item label="Bir maç seçin..." value={null} />
        {matches.map((match: any) => (
          <Picker.Item
            key={match.id}
            label={`#${match.id} - ${match.fieldName}`}
            value={match.id}
          />
        ))}
      </Picker>

      <Button title="Teklif Gönder" color="#2E7D32" onPress={handleSendOffer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 }
});

export default SendOfferScreen;

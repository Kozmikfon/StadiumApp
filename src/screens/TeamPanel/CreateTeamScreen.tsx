import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';

const CreateTeamScreen = () => {
  const [teamName, setTeamName] = useState('');
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchPlayerId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert("⚠️ Uyarı", "Giriş yapmanız gerekiyor.");
          return;
        }

        const decoded: any = jwtDecode(token);
        console.log("🎯 Decoded Token:", decoded);
        if (decoded && decoded.playerId) {
          setPlayerId(Number(decoded.playerId));
          console.log("✅ Player ID:", decoded.playerId);
        } else {
          throw new Error("Token'da playerId yok.");
        }

      } catch (error) {
        console.error("❌ Token çözümleme hatası:", error);
        Alert.alert("Hata", "Kullanıcı bilgileri alınamadı.");
      }
    };

    fetchPlayerId();
  }, []);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert('⚠️ Uyarı', 'Lütfen bir takım adı girin.');
      return;
    }

    if (!playerId) {
      Alert.alert('⚠️ Hata', 'Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        'http://10.0.2.2:5275/api/Teams',
        {
          name: teamName,
          captainId: playerId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Takım oluşturuldu:", response.data);
     Alert.alert('✅ Başarılı', 'Takım başarıyla oluşturuldu!', [
  {
    text: 'Tamam',
    onPress: () => navigation.navigate('PlayerProfile')
  }
]);

      setTeamName('');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Sunucu hatası';
        console.error("❌ API Hatası:", message);
        Alert.alert('Hata', message);
      } else {
        console.error("❌ Bilinmeyen Hata:", err);
        Alert.alert('Hata', 'Bilinmeyen bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡 Takım Oluştur</Text>
      <TextInput
        style={styles.input}
        placeholder="Takım adı giriniz"
        value={teamName}
        onChangeText={setTeamName}
      />
      <Button
        title={loading ? 'Oluşturuluyor...' : 'Takımı Oluştur'}
        onPress={handleCreateTeam}
        color="#2E7D32"
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 6
  }
});

export default CreateTeamScreen;

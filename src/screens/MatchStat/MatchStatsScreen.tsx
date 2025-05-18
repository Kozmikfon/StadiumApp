import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const MatchStatsScreen = ({ route }: any) => {
  const { matchId } = route.params;
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [stat, setStat] = useState<any>({
    goals: '0',
    assists: '0',
    yellowCards: '0',
    redCards: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      const pid = decoded.playerId;
      setPlayerId(pid);

      const offersRes = await axios.get(`http://10.0.2.2:5275/api/Offers/accepted-by-match/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const player = offersRes.data.find((o: any) => o.receiverId === pid);
      if (player) setPlayerName(player.receiverName);

      setLoading(false);
    };
    fetchPlayerInfo();
  }, [matchId]);

  const handleChange = (field: string, value: string) => {
    setStat((prev: typeof stat) => ({ ...prev, [field]: value }));

  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(`http://10.0.2.2:5275/api/MatchStats`, {
        playerId,
        matchId,
        goals: parseInt(stat.goals),
        assists: parseInt(stat.assists),
        yellowCards: parseInt(stat.yellowCards),
        redCards: parseInt(stat.redCards)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('✅ Başarılı', 'İstatistikleriniz kaydedildi.');
    } catch (error) {
      console.error('❌ Hata:', error);
      Alert.alert('Hata', 'İstatistikler kaydedilemedi.');
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Yükleniyor...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Kişisel Maç İstatistikleri</Text>
      <Text style={styles.subtitle}>Oyuncu: {playerName}</Text>

      <View style={styles.card}>
        <View style={styles.row}><Text>🎯 Gol:</Text><TextInput keyboardType="numeric" style={styles.input} value={stat.goals} onChangeText={(text) => handleChange('goals', text)} /></View>
        <View style={styles.row}><Text>🎯 Asist:</Text><TextInput keyboardType="numeric" style={styles.input} value={stat.assists} onChangeText={(text) => handleChange('assists', text)} /></View>
        <View style={styles.row}><Text>🟨 Sarı Kart:</Text><TextInput keyboardType="numeric" style={styles.input} value={stat.yellowCards} onChangeText={(text) => handleChange('yellowCards', text)} /></View>
        <View style={styles.row}><Text>🟥 Kırmızı Kart:</Text><TextInput keyboardType="numeric" style={styles.input} value={stat.redCards} onChangeText={(text) => handleChange('redCards', text)} /></View>
      </View>

      <Button title="Kaydet" color="#4CAF50" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  card: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, paddingHorizontal: 10, width: 60, textAlign: 'center' }
});

export default MatchStatsScreen;

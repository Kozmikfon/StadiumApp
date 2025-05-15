import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PlayerProfileScreen = ({ navigation }: any) => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const uid = decoded.userId;
        setUserId(uid);

        const response = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPlayer(response.data);
      } catch (error) {
        console.error('Oyuncu bilgisi alınamadı:', error);
        Alert.alert('Hata', 'Oyuncu bilgisi getirilemedi.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleLeaveTeam = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://10.0.2.2:5275/api/TeamMembers/${player.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('✅ Takımdan ayrıldınız');
      setPlayer({ ...player, teamId: null, teamName: null });
    } catch (error) {
      Alert.alert('❌ Hata', 'Takımdan ayrılamadınız.');
    }
  };

  const handleJoinTeam = () => {
    if (userId) {
      navigation.navigate('TeamList', { userId });
    } else {
      Alert.alert("Hata", "Kullanıcı bilgisi alınamadı.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />;
  }

  if (!player) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>❌ Oyuncu profili bulunamadı.</Text>
        <Button
          title="Profil Oluştur"
          onPress={() => navigation.replace('CompletePlayerProfile')}
        />
      </View>
    );
  }

  const formattedDate = new Date(player.createAd).toLocaleDateString('tr-TR');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Oyuncu Profilim</Text>

      <View style={styles.infoCard}>
        <Text><Text style={styles.label}>Ad:</Text> {player.firstName} {player.lastName}</Text>
        <Text><Text style={styles.label}>Pozisyon:</Text> {player.position || 'Belirtilmemiş'}</Text>
        <Text><Text style={styles.label}>Seviye:</Text> {player.skillLevel}</Text>
        <Text><Text style={styles.label}>Rating:</Text> {player.rating}</Text>
        <Text><Text style={styles.label}>Email:</Text> {player.email}</Text>
        <Text><Text style={styles.label}>Kayıt Tarihi:</Text> {formattedDate}</Text>
        <Text><Text style={styles.label}>Takım:</Text> {player.teamName || 'Takımsız'}</Text>
      </View>

      {player.teamId ? (
        <Button title="Takımdan Ayrıl" color="red" onPress={handleLeaveTeam} />
      ) : (
        <Button title="Takıma Katıl" color="#2E7D32" onPress={handleJoinTeam} />
      )}

      <View style={{ marginTop: 10 }} />
      <Button title="📅 Maçlarım" color="#1976D2" onPress={() => navigation.navigate('MyMatches')} />
      <View style={{ marginTop: 10 }} />
      <Button title="📨 Gelen Teklifler" color="#FFA000" onPress={() => navigation.navigate('MyOffers')} />
      <View style={{ marginTop: 10 }} />
      <Button title="👥 Oyuncular Listesi" color="#6A1B9A" onPress={() => navigation.navigate('PlayerList')} />
        <View style={{ marginTop: 10 }} />
<Button title="🛠 Profilimi Düzenle" color="#00796B" onPress={() => navigation.navigate('EditPlayerProfile')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  infoCard: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  label: { fontWeight: 'bold' },
  warning: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16
  }
});

export default PlayerProfileScreen;

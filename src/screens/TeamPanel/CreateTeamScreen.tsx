import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const CreateTeamScreen = () => {
  const [teamName, setTeamName] = useState('');
  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlayerId = async () => {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      setPlayerId(decoded.playerId);
    };
    fetchPlayerId();
  }, []);

  const handleCreateTeam = async () => {
    if (!teamName || !playerId) {
      Alert.alert('⚠️ Uyarı', 'Takım adı boş olamaz.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://10.0.2.2:5275/api/Teams', {
        name: teamName,
        captainId: playerId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('✅ Başarılı', 'Takım oluşturuldu!');
      setTeamName('');
    } catch (err) {
      console.error('❌ Takım oluşturulamadı:', err);
      Alert.alert('Hata', 'Takım oluşturma sırasında hata oluştu.');
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
      <Button title="Takımı Oluştur" onPress={handleCreateTeam} color="#2E7D32" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 6
  }
});

export default CreateTeamScreen;

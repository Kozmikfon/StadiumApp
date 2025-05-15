import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const EditPlayerProfileScreen = ({ navigation }: any) => {
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    skillLevel: 0,
    rating: 0,
    createAd: '',
    teamId: null as number | null,
  });

  useEffect(() => {
    const fetchPlayer = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        const id = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        setPlayerId(id);

        const res = await axios.get(`http://localhost:5275/api/Players/${id}`);
        setForm(res.data);
      }
    };

    fetchPlayer();
  }, []);

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5275/api/Players/${playerId}`, form);
      Alert.alert('Başarılı', 'Profiliniz güncellendi.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Profil güncellenemedi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilini Güncelle</Text>

      <TextInput style={styles.input} placeholder="Ad" value={form.firstName} onChangeText={(text) => handleChange('firstName', text)} />
      <TextInput style={styles.input} placeholder="Soyad" value={form.lastName} onChangeText={(text) => handleChange('lastName', text)} />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={(text) => handleChange('email', text)} />
      <TextInput style={styles.input} placeholder="Pozisyon" value={form.position} onChangeText={(text) => handleChange('position', text)} />
      <TextInput style={styles.input} placeholder="Seviye" keyboardType="numeric" value={form.skillLevel.toString()} onChangeText={(text) => handleChange('skillLevel', parseInt(text))} />
      <TextInput style={styles.input} placeholder="Puan" keyboardType="numeric" value={form.rating.toString()} onChangeText={(text) => handleChange('rating', parseFloat(text))} />
      <TextInput style={styles.input} placeholder="Oluşturulma Tarihi" value={form.createAd?.slice(0, 10)} onChangeText={(text) => handleChange('createAd', text)} />
      <TextInput style={styles.input} placeholder="Takım ID" keyboardType="numeric" value={form.teamId ? form.teamId.toString() : ''} onChangeText={(text) => handleChange('teamId', text ? parseInt(text) : null)} />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditPlayerProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 10, borderRadius: 8 },
  button: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

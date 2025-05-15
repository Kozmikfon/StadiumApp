import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const EditPlayerProfileScreen = ({ navigation }: any) => {
  const [form, setForm] = useState({
    email: '',
    position: '',
  });

  const [playerId, setPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const id = decoded.playerId; // ya da playerId

        setPlayerId(id);

        const res = await axios.get(`http://10.0.2.2:5275/api/Players/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          email: res.data.email || '',
          position: res.data.position || '',
        });
      } catch (error) {
        Alert.alert('Hata', 'Profil bilgisi alınamadı');
        console.error("GET HATASI", error);
      }
    };

    fetchPlayer();
  }, []);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !playerId) return;

      console.log("Giden veri:", form);

      await axios.put(
        `http://10.0.2.2:5275/api/Players/${playerId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Başarılı', 'Profiliniz güncellendi.');
      navigation.goBack();
    } catch (error: any) {
      console.error("PUT HATASI:", error.response?.data || error.message);
      Alert.alert('Hata', 'Güncelleme başarısız. Lütfen e-posta ve pozisyon girin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📧 Profilini Güncelle</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <TextInput
        placeholder="Pozisyon"
        style={styles.input}
        value={form.position}
        onChangeText={(text) => handleChange('position', text)}
      />

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

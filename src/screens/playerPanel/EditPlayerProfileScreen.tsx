import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,ToastAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Picker } from '@react-native-picker/picker';

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
        
        if (Platform.OS === 'android') {
  ToastAndroid.show("✅ Profil başarıyla güncellendi!", ToastAndroid.SHORT);
}


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
        if (!form.email || !form.email.includes('@')) {
  Alert.alert("Geçersiz Email", "Lütfen geçerli bir e-posta adresi girin.");
  return;
}

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

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Pozisyon</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={form.position}
    onValueChange={(value) => handleChange('position', value)}
    style={styles.picker}
  >
    <Picker.Item label="Pozisyon seçin" value="" />
    <Picker.Item label="Kaleci" value="Kaleci" />
    <Picker.Item label="Defans" value="Defans" />
    <Picker.Item label="Orta Saha" value="Orta Saha" />
    <Picker.Item label="Forvet" value="Forvet" />
  </Picker>
</View>


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
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  pickerContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginBottom: 15,
},
picker: {
  height: 50,
  width: '100%',
},

});

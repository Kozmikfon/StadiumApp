// components/CreateTeamModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5275/api';

interface Props {
  visible: boolean;
  onClose: () => void;
  playerId: number;
  onTeamCreated: () => void;
}

const CreateTeamModal = ({ visible, onClose, playerId, onTeamCreated }: Props) => {
  const [teamName, setTeamName] = useState('');

  const handleCreate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_URL}/Teams`, {
        name: teamName,
        captainId: playerId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Başarılı', 'Takım oluşturuldu');
      setTeamName('');
      onTeamCreated();
      onClose();
    } catch (error) {
      Alert.alert('Hata', 'Takım oluşturulamadı');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Takım Oluştur</Text>
          <TextInput
            placeholder="Takım Adı"
            value={teamName}
            onChangeText={setTeamName}
            style={styles.input}
          />
          <TouchableOpacity onPress={handleCreate} style={styles.button}>
            <Text style={styles.buttonText}>Oluştur</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: '#ccc' }]}>
            <Text style={[styles.buttonText, { color: '#000' }]}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CreateTeamModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modal: { width: '85%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#1e88e5', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

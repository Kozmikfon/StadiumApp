// components/LeaveTeamModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5275/api';

interface Props {
  visible: boolean;
  onClose: () => void;
  playerId: number;
  onTeamLeft: () => void;
}

const LeaveTeamModal = ({ visible, onClose, playerId, onTeamLeft }: Props) => {
  const handleLeave = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/TeamMembers/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Başarılı', 'Takımdan ayrıldınız.');
      onTeamLeft();
      onClose();
    } catch (error) {
      Alert.alert('Hata', 'Takımdan ayrılamadınız.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Takımdan Ayrıl</Text>
          <Text style={styles.confirmText}>Gerçekten takımdan ayrılmak istiyor musunuz?</Text>
          <TouchableOpacity onPress={handleLeave} style={styles.leaveButton}>
            <Text style={styles.leaveButtonText}>Evet, Ayrıl</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LeaveTeamModal;

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modal: { width: '85%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  confirmText: { marginBottom: 20 },
  leaveButton: { backgroundColor: '#e53935', padding: 10, borderRadius: 6, alignItems: 'center' },
  leaveButtonText: { color: 'white', fontWeight: 'bold' },
  cancelButton: { marginTop: 10, padding: 10, alignItems: 'center' },
  cancelButtonText: { color: '#555', fontWeight: 'bold' },
});

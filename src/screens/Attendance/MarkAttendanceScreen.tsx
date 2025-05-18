import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const MarkAttendanceScreen = ({ route }: any) => {
  const { matchId } = route.params;

  const [playerId, setPlayerId] = useState<number | null>(null);
  const [attendanceId, setAttendanceId] = useState<number | null>(null);
  const [isPresent, setIsPresent] = useState<boolean | null>(null);
  const [matchDate, setMatchDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      const pid = decoded.playerId;
      setPlayerId(pid);

      // Maç tarihi
      const matchRes = await axios.get(`http://10.0.2.2:5275/api/Matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatchDate(new Date(matchRes.data.matchDate));

      // Katılım bilgisi
      const res = await axios.get(`http://10.0.2.2:5275/api/Attendance/match/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const existing = res.data.find((a: any) => a.playerId === pid);
      if (existing) {
        setAttendanceId(existing.id);
        setIsPresent(existing.isPresent);
      }
    };

    fetchData();
  }, [matchId]);

  const handleToggle = async () => {
    const token = await AsyncStorage.getItem('token');
    if (attendanceId === null) {
      await axios.post('http://10.0.2.2:5275/api/Attendance', {
        playerId,
        matchId,
        isPresent: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('❌ Katılamayacağınız kaydedildi');
      setIsPresent(false);
    } else {
      const updated = !isPresent;
      await axios.put(`http://10.0.2.2:5275/api/Attendance/${attendanceId}`, updated, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setIsPresent(updated);
      Alert.alert(updated ? '✔️ Katıldım' : '❌ Katılamadım');
    }
  };

  const now = new Date();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Maç Katılım Durumu</Text>

      {matchDate ? (
        now < matchDate ? (
          <TouchableOpacity onPress={handleToggle} style={[styles.button, {
            backgroundColor: '#F44336'
          }]}>
            <Text style={styles.buttonText}>❌ Katılamayacağım</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.attendedText}>✔️ Bu maça katıldınız.</Text>
        )
      ) : (
        <Text>Maç bilgisi yükleniyor...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  button: {
    padding: 15,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  attendedText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default MarkAttendanceScreen;

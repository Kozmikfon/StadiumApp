import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const CreateMatchScreen = ({ navigation }: any) => {
  const [team1Id, setTeam1Id] = useState<number | null>(null);
  const [team2Id, setTeam2Id] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [matchDate, setMatchDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [hasTeam, setHasTeam] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    fetchPlayerTeam();
    fetchTeams();
  }, []);

  const fetchPlayerTeam = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const userId = decoded.userId;

      const response = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const player = response.data;
      if (player.teamId) {
        setTeam1Id(player.teamId);
        setHasTeam(true);
      } else {
        setHasTeam(false);
      }
    } catch (error) {
      console.error('❌ Takım alınamadı:', error);
      setHasTeam(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://10.0.2.2:5275/api/Teams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(response.data);
    } catch (error) {
      console.error('❌ Takımlar alınamadı:', error);
    }
  };

const handleDateChange = (_: any, selectedDate?: Date) => {
  setShowDatePicker(false);
  if (selectedDate) {
    // Tarihi set et, saati koru
    const updated = new Date(matchDate);
    updated.setFullYear(selectedDate.getFullYear());
    updated.setMonth(selectedDate.getMonth());
    updated.setDate(selectedDate.getDate());
    setMatchDate(updated);
    setShowTimePicker(true); // sonra saat seçtir
  }
};

const handleTimeChange = (_: any, selectedTime?: Date) => {
  setShowTimePicker(false);
  if (selectedTime) {
    const updated = new Date(matchDate);
    updated.setHours(selectedTime.getHours());
    updated.setMinutes(selectedTime.getMinutes());
    setMatchDate(updated);
  }
};


  const handleCreateMatch = async () => {
    if (!team1Id || !team2Id || !fieldName || !matchDate) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (parseInt(team2Id) === team1Id) {
      Alert.alert('Uyarı', 'Kendi takımınızla eşleşemezsiniz.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      await axios.post('http://10.0.2.2:5275/api/Matches', {
        team1Id,
        team2Id: parseInt(team2Id),
        fieldName,
        matchDate: matchDate.toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('✅ Maç başarıyla oluşturuldu!');
      navigation.goBack();
    } catch (error: any) {
      console.error('❌ Hata:', error?.response?.data || error.message);
      Alert.alert('❌ Hata', 'Maç oluşturulamadı.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚽ Maç Oluştur</Text>

      {!hasTeam ? (
        <Text style={styles.warning}>
          ⚠️ Maç oluşturmak için bir takıma katılmanız gerekiyor.
        </Text>
      ) : (
        <>
          <Text style={styles.label}>Rakip Takımı Seçin</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={team2Id}
              onValueChange={(itemValue) => setTeam2Id(itemValue)}
            >
              <Picker.Item label="Takım Seçin" value="" />
              {teams.map((team) => (
                <Picker.Item
                  key={team.id}
                  label={team.name}
                  value={team.id.toString()}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Saha Adı</Text>
          <TextInput
            style={styles.input}
            value={fieldName}
            onChangeText={setFieldName}
          />

          <Text style={styles.label}>Tarih</Text>
         <Pressable onPress={() => setShowDatePicker(true)}>
  <Text style={styles.dateInput}>
    {matchDate.toLocaleDateString()} {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </Text>
</Pressable>


{showDatePicker && (
  <DateTimePicker
    value={matchDate}
    mode="date"
    display="default"
    onChange={handleDateChange}
  />
)}

{showTimePicker && (
  <DateTimePicker
    value={matchDate}
    mode="time"
    display="default"
    onChange={handleTimeChange}
  />
)}




          <Button title="➕ Maçı Oluştur" onPress={handleCreateMatch} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15
  },
  warning: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    color: '#333',
    backgroundColor: '#f9f9f9',
    marginBottom: 10
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10
  }
});

export default CreateMatchScreen;

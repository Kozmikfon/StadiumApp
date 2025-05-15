import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import { AirbnbRating } from 'react-native-ratings';

const CreateReviewScreen = () => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [reviewedTeamId, setReviewedTeamId] = useState<number | null>(null);
  const [reviewedUserId, setReviewedUserId] = useState<number | null>(null); // istersen

  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { matchId } = route.params;

  useEffect(() => {
    const loadReviewer = async () => {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      setReviewedTeamId(decoded.teamId); // veya reviewedUserId = decoded.playerId
    };

    loadReviewer();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');

      await axios.post(
        'http://10.0.2.2:5275/api/Reviews',
        {
          matchId,
          reviewerId: decoded.playerId,
          reviewedUserId,       // eğer oyuncu yorumu
          reviewedTeamId,       // eğer takım yorumu
          comment,
          rating: parseInt(rating)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert('✅ Başarılı', 'Değerlendirme gönderildi.');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Hata:', error);
      Alert.alert('Hata', 'Değerlendirme gönderilemedi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Değerlendirme Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="Yorumunuz"
        value={comment}
        onChangeText={setComment}
      />

      <TextInput
        style={styles.input}
        placeholder="Puan (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <Button title="Gönder" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  }
});

export default CreateReviewScreen;

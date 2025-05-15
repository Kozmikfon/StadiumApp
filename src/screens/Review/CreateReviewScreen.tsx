import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';

const CreateReviewScreen = () => {
  const [rating, setRating] = useState<number>(3);
  const [comment, setComment] = useState('');
  const [reviewerId, setReviewerId] = useState<number | null>(null);

  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { matchId, reviewedUserId } = route.params;

  useEffect(() => {
    const loadReviewer = async () => {
      const token = await AsyncStorage.getItem('token');
      const decoded: any = jwtDecode(token || '');
      setReviewerId(decoded.playerId);
    };

    loadReviewer();
  }, []);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("⚠️ Uyarı", "Yorum boş olamaz.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      await axios.post(
        'http://10.0.2.2:5275/api/Reviews',
        {
          matchId,
          reviewerId,
          reviewedUserId,
          comment,
          rating
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert("✅ Başarılı", "Değerlendirme gönderildi.");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Gönderme hatası:", error);
      Alert.alert("Hata", "Yorum gönderilemedi.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Oyuncuyu Değerlendir</Text>

      <Text style={styles.label}>Puan Ver</Text>
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity
            key={val}
            onPress={() => setRating(val)}
            style={[
              styles.ratingButton,
              rating === val && styles.selectedRating
            ]}
          >
            <Text style={{ color: rating === val ? 'white' : '#000' }}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Yorum</Text>
      <TextInput
        style={styles.input}
        placeholder="Yorumunuzu yazın"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Button title="GÖNDER" color="#4CAF50" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  label: { fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9'
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  ratingButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ccc',
    backgroundColor: '#fff'
  },
  selectedRating: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50'
  }
});

export default CreateReviewScreen;

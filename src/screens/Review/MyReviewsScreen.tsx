import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const MyReviewsScreen = ({ navigation }: any) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        const playerId = decoded.playerId;

        const res = await axios.get(`http://10.0.2.2:5275/api/Reviews/byUser/${playerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setReviews(res.data);
      } catch (error) {
        console.error("❌ Yorumlar alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#6A1B9A" style={{ marginTop: 50 }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>💬 Yorumlarım</Text>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.reviewCard}
            onPress={() => navigation.navigate('MatchDetail', { matchId: item.matchId })}
          >
            <Text style={styles.field}>🏟 {item.matchField} - {new Date(item.matchDate).toLocaleDateString()}</Text>
            <Text>⭐ Puan: {item.rating}</Text>
            <Text>💬 {item.comment}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Hiç yorum yapılmamış.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  reviewCard: {
    backgroundColor: '#f3e5f5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  field: { fontWeight: 'bold', marginBottom: 4 }
});

export default MyReviewsScreen;

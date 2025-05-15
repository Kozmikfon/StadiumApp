import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const MyReviewsScreen = ({ navigation }: any) => {
  const [mentions, setMentions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentions = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const playerName = decoded.firstName?.toLowerCase().trim(); // 👈 kritik

        const res = await axios.get(`http://10.0.2.2:5275/api/Reviews/mentions/${playerName}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMentions(res.data);
      } catch (error) {
        console.error("❌ Mention yorumları alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentions();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#6A1B9A" style={{ marginTop: 50 }} />;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>💬 Adınızın Geçtiği Yorumlar</Text>

      <FlatList
        data={mentions}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MatchDetail', { matchId: item.matchId })}
          >
            <Text style={styles.matchInfo}>🏟 {item.fieldName} ({new Date(item.matchDate).toLocaleDateString('tr-TR')})</Text>
            <Text>⭐ Puan: {item.rating}</Text>
            <Text>💬 {item.comment}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Adınızın geçtiği yorum bulunamadı.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#f3e5f5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10
  },
  matchInfo: {
    fontWeight: 'bold',
    marginBottom: 5
  }
});

export default MyReviewsScreen;

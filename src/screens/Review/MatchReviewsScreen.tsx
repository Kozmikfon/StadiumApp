import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Alert, TouchableOpacity, StyleSheet, Button, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const MatchReviewsScreen = ({ route }: any) => {
  const { matchId } = route.params;

  const [playerId, setPlayerId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(3);
  const [comment, setComment] = useState('');
  const [likedComments, setLikedComments] = useState<{ [key: number]: boolean }>({});
  const [commentLikeCounts, setCommentLikeCounts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        const pid = decoded.playerId;
        setPlayerId(pid);

        const res = await axios.get(`http://10.0.2.2:5275/api/Reviews`);
        const matchReviews = res.data.filter((r: any) => r.matchId === matchId);
        setReviews(matchReviews);

        const newLiked: any = {};
        const newCounts: any = {};

        for (const review of matchReviews) {
          const likeRes = await axios.get(`http://10.0.2.2:5275/api/CommentLikes/has-liked/${review.id}/${pid}`);
          const countRes = await axios.get(`http://10.0.2.2:5275/api/CommentLikes/count/${review.id}`);
          newLiked[review.id] = likeRes.data;
          newCounts[review.id] = countRes.data;
        }

        setLikedComments(newLiked);
        setCommentLikeCounts(newCounts);
      } catch (error) {
        console.error('❌ Veriler alınamadı:', error);
      }
    };

    fetchData();
  }, [matchId]);

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
          reviewerId: playerId,
          reviewedUserId: null,
          reviewedTeamId: null,
          comment,
          rating
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert("✅ Başarılı", "Yorum gönderildi.");
      setComment('');
      setRating(3);

      const res = await axios.get(`http://10.0.2.2:5275/api/Reviews`);
      setReviews(res.data.filter((r: any) => r.matchId === matchId));
    } catch (error) {
      console.error("❌ Gönderme hatası:", error);
      Alert.alert("Hata", "Yorum gönderilemedi.");
    }
  };

  const toggleCommentLike = async (reviewId: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const decoded: any = jwtDecode(token || '');
    const pid = Number(decoded.playerId);

    const res = await axios.post(`http://10.0.2.2:5275/api/CommentLikes`, {
      reviewId,
      playerId: pid
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Güncel beğeni durumu ve sayıyı al
    const likeCheck = await axios.get(`http://10.0.2.2:5275/api/CommentLikes/has-liked/${reviewId}/${pid}`);
    const likeCount = await axios.get(`http://10.0.2.2:5275/api/CommentLikes/count/${reviewId}`);

    setLikedComments(prev => ({ ...prev, [reviewId]: likeCheck.data }));
    setCommentLikeCounts(prev => ({ ...prev, [reviewId]: likeCount.data }));
  } catch (error) {
    console.error("❌ Beğeni hatası:", error);
    Alert.alert("Hata", "Beğeni işlemi sırasında hata oluştu.");
  }
};


  const handleDeleteReview = async (reviewId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://10.0.2.2:5275/api/Reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviews(prev => prev.filter(r => r.id !== reviewId));
      Alert.alert("✅ Silindi", "Yorum başarıyla silindi.");
    } catch (error) {
      console.error("❌ Silme hatası:", error);
      Alert.alert("Hata", "Yorum silinirken bir hata oluştu.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📝 Maç Yorumları</Text>

      <View style={styles.reviewForm}>
        <Text style={styles.label}>Puan Ver</Text>
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((val) => (
            <TouchableOpacity
              key={val}
              onPress={() => setRating(val)}
              style={[styles.ratingButton, rating === val && styles.selectedRating]}
            >
              <Text style={{ color: rating === val ? 'white' : '#000' }}>{val}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Yorum</Text>
        <TextInput
          style={styles.input}
          placeholder='Örn: @mehmet iyi oynadı'
          value={comment}
          onChangeText={setComment}
          multiline
        />

        <Button title="GÖNDER" color="#4CAF50" onPress={handleSubmit} />
      </View>

      <Text style={[styles.title, { marginTop: 30 }]}>📄 Yapılan Yorumlar</Text>
      {reviews.length === 0 ? (
        <Text style={styles.empty}>Henüz yorum yapılmamış.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <TouchableOpacity
  onPress={() => toggleCommentLike(item.id)}
  style={{
    backgroundColor: likedComments[item.id] ? '#C62828' : '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10
  }}
>
  <Text style={{ color: likedComments[item.id] ? 'white' : '#444' }}>
    {likedComments[item.id] ? '❤️ Beğendin' : '🤍 Beğen'}
  </Text>
</TouchableOpacity>
<Text>Toplam Beğeni: {commentLikeCounts[item.id] || 0}</Text>

              </View>

              <View style={styles.reviewHeader}>
                <Text style={styles.reviewRating}>⭐ {item.rating}</Text>
                {Number(item.reviewerId) === Number(playerId) && (

                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert("Yorumu Sil", "Silmek istiyor musun?", [
                        { text: "İptal", style: "cancel" },
                        { text: "Sil", style: "destructive", onPress: () => handleDeleteReview(item.id) }
                      ]);
                    }}
                  >
                    <Text style={styles.deleteBtn}>🗑</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.reviewText}>💬 {item.comment}</Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  reviewForm: { marginBottom: 30 },
  label: { fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
    marginBottom: 20
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
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  reviewRating: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  reviewText: {
    fontSize: 14,
    color: '#333'
  },
  deleteBtn: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: 'bold',
    paddingHorizontal: 8
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic'
  }
});

export default MatchReviewsScreen;
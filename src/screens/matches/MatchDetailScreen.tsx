import React, { useEffect, useState,useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import { useRoute,useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const MatchDetailScreen =({ navigation }: any) => {
  const route = useRoute<any>();
  const { matchId } = route.params;

  const [match, setMatch] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [acceptedOffers, setAcceptedOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [playerStats, setPlayerStats] = useState<{ [key: number]: any }>({});


  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded: any = jwtDecode(token || '');
        setPlayerId(decoded.playerId);

        const matchRes = await axios.get(`http://10.0.2.2:5275/api/Matches/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const offersRes = await axios.get(`http://10.0.2.2:5275/api/Offers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const acceptedRes = await axios.get(`http://10.0.2.2:5275/api/Offers/accepted-by-match/${matchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        for (const offer of acceptedRes.data) {
        const statsRes = await axios.get(`http://10.0.2.2:5275/api/Players/stats/${offer.receiverId}`);
        setPlayerStats(prev => ({ ...prev, [offer.receiverId]: statsRes.data }));
  }

        setMatch(matchRes.data);
        const filteredOffers = offersRes.data.filter((o: any) => o.matchId === matchId);
        setOffers(filteredOffers);
        setAcceptedOffers(acceptedRes.data);
      } catch (error) {
        console.error("❌ Match detayları alınamadı:", error);
        Alert.alert("Hata", "Maç detayları yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://10.0.2.2:5275/api/Reviews`);
        const onlyThisMatch = res.data.filter((r: any) => r.matchId === matchId);
        setReviews(onlyThisMatch);
      } catch (err) {
        console.error("❌ Yorumlar alınamadı:", err);
      }
    };
    

    
    fetchDetails();
  }, [matchId]);
 
  // ✅ acceptedOffers değiştikçe logla
useEffect(() => {
  console.log("📦 acceptedOffers", acceptedOffers);
}, [acceptedOffers]);

  useFocusEffect(
    useCallback(() => {
      const fetchReviews = async () => {
        try {
          const res = await axios.get(`http://10.0.2.2:5275/api/Reviews`);
          const onlyThisMatch = res.data.filter((r: any) => r.matchId === matchId);
          setReviews(onlyThisMatch);
        } catch (err) {
          console.error("❌ Yorumlar alınamadı:", err);
        }
      };

      fetchReviews();
    }, [matchId])
  );

const translateStatus = (status: string) => {
  switch (status) {
    case "Accepted": return "Kabul Edildi";
    case "Rejected": return "Reddedildi";
    case "Pending": return "Beklemede";
    default: return status;
  }
};

  const handleUpdateStatus = async (offerId: number, newStatus: "Accepted" | "Rejected") => {
  try {
    const token = await AsyncStorage.getItem('token');
    await axios.put(
      `http://10.0.2.2:5275/api/Offers/update-status/${offerId}`,
      `"${newStatus}"`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    Alert.alert("✅ Başarılı", `Teklif "${translateStatus(newStatus)}" olarak güncellendi.`);

    // ✅ Listeyi güncelle
    const refreshedOffers = await axios.get(`http://10.0.2.2:5275/api/Offers`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const refreshedAccepted = await axios.get(`http://10.0.2.2:5275/api/Offers/accepted-by-match/${matchId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setOffers(refreshedOffers.data.filter((o: any) => o.matchId === matchId));
    setAcceptedOffers(refreshedAccepted.data);
  } catch (error) {
    console.error("❌ Güncelleme hatası:", error);
    Alert.alert("Hata", "Teklif durumu güncellenemedi.");
  }
};



  const removeOffer = async (offerId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://10.0.2.2:5275/api/Offers/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("✅ Oyuncu çıkarıldı", "Teklif başarıyla silindi.");
      setAcceptedOffers(prev => prev.filter(o => o.id !== offerId));
    } catch (error) {
      console.error("❌ Oyuncu silinemedi:", error);
      Alert.alert("Hata", "Oyuncu maçtan çıkarılamadı.");
    }
  };

  //yorum silme
  const handleDeleteReview = async (reviewId: number) => {
  try {
    const token = await AsyncStorage.getItem('token');

    await axios.delete(`http://10.0.2.2:5275/api/Reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Alert.alert("✅ Silindi", "Yorum başarıyla silindi.");
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  } catch (err) {
    console.error("❌ Silme hatası:", err);
    Alert.alert("Hata", "Yorum silinemedi.");
  }
};


  if (loading) {
    return <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 30 }} />;
  }

 return (
  <View style={styles.container}>
    <Text style={styles.title}>🏟 Maç Detayı</Text>

    <View style={styles.card}>
      <Text><Text style={styles.label}>Saha:</Text> {match.fieldName}</Text>
      <Text><Text style={styles.label}>Tarih:</Text> {new Date(match.matchDate).toLocaleString()}</Text>
      <Text><Text style={styles.label}>Takım 1:</Text> {match.team1Name}</Text>
      <Text><Text style={styles.label}>Takım 2:</Text> {match.team2Name}</Text>
    </View>

    <Text style={[styles.title, { fontSize: 18 }]}>📨 Gelen Teklifler</Text>
    <FlatList
      data={offers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.offerCard}>
          <Text>Gönderen Oyuncu ID: {item.senderId}</Text>
          <Text>Alıcı Oyuncu ID: {item.receiverId}</Text>
          <Text>Durum: {translateStatus(item.status)}</Text>

          {item.status === "Pending" && item.receiverId === playerId && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#4CAF50' }]}
                onPress={() => handleUpdateStatus(item.id, "Accepted")}
              >
                <Text style={styles.statusText}>Kabul Et</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: '#F44336' }]}
                onPress={() => handleUpdateStatus(item.id, "Rejected")}
              >
                <Text style={styles.statusText}>Reddet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Bu maça teklif gönderilmemiş.</Text>}
    />

    <Text style={[styles.title, { fontSize: 18, marginTop: 20 }]}>✅ Maça Çıkacak Oyuncular</Text>
    <FlatList
      data={acceptedOffers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.playerCard}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.receiverName}</Text>
          <Text>Teklif Durumu: {translateStatus(item.status)}</Text>

          {playerStats[item.receiverId] ? (
            <View style={styles.playerStats}>
              <Text>🎮 Maç: {playerStats[item.receiverId].totalMatches}</Text>
              <Text>📨 Teklif: {playerStats[item.receiverId].totalOffers}</Text>
              <Text>📈 Puan: {playerStats[item.receiverId].averageRating}</Text>
              <Text>📅 Üyelik: {playerStats[item.receiverId].membershipDays} gün</Text>
            </View>
          ) : (
            <Text style={{ fontStyle: 'italic', color: '#999' }}>Yükleniyor...</Text>
          )}
          <Button
  title="📝 Katılım Durumu"
  onPress={() => navigation.navigate('MarkAttendance', { matchId })}
/>
          <Button
            title="📝 Değerlendir"
            color="#6A1B9A"
            onPress={() =>
              navigation.navigate('CreateReview', {
                matchId: match.id,
                reviewedUserId: item.receiverId
              })
            }
          />

          {match.team1CaptainId === playerId && (
            <TouchableOpacity
              onPress={() => removeOffer(item.id)}
              style={{ backgroundColor: 'red', padding: 6, borderRadius: 6, marginTop: 6 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>❌ Oyuncuyu Çıkar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Henüz kabul edilen oyuncu yok.</Text>}
    />

    {/* 💬 Yorumları Görüntüle butonu */}
   <TouchableOpacity
  onPress={() => navigation.navigate('MatchReviews', { matchId: match.id })}
  style={{ backgroundColor: '#1976D2', padding: 10, borderRadius: 6, marginTop: 20 }}
>
  <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
    📝 Yorum Yap & Yorumları Görüntüle
  </Text>
</TouchableOpacity>


  </View>
);


}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
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
  marginBottom: 6,
},
reviewRating: {
  fontSize: 16,
  fontWeight: 'bold',
  
},
reviewText: {
  fontSize: 14,
  color: '#333',
},
deleteBtn: {
  fontSize: 16,
  color: '#F44336',
  fontWeight: 'bold',
  paddingHorizontal: 8
}

,
  playerCard: {
  backgroundColor: '#f9f9f9',
  padding: 12,
  marginVertical: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ccc',
},
playerStats: {
  marginTop: 5,
  paddingLeft: 10,
},

  offerCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2
  },
  label: { fontWeight: 'bold' },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 10
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default MatchDetailScreen;

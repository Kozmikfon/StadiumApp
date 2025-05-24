import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator , Dimensions, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

const PlayerProfileScreen = ({ navigation }: any) => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalOffers: 0,
    averageRating: 0,
    membershipDays: 0,
  });

  // 🔄 Oyuncu bilgilerini çek
  const fetchPlayerData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decoded: any = jwtDecode(token);
      const uid = decoded.userId;
      setUserId(uid);

      const response = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${uid}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPlayer(response.data);
    } catch (error) {
      console.error('❌ Oyuncu bilgisi alınamadı:', error);
      Alert.alert('Hata', 'Oyuncu bilgisi getirilemedi.');
    }
  };

  // 📊 İstatistikleri çek
  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token || !player?.id) return;

      const res = await axios.get(`http://10.0.2.2:5275/api/Players/stats/${player.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data);
    } catch (err) {
      console.error("❌ Stat çekilemedi", err);
    }
  };

  // 🔄 Sayfa ilk açıldığında veri çek
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await fetchPlayerData();
      setLoading(false);
    };

    initialize();
  }, []);

  // 🔁 Sayfa her ziyaret edildiğinde yeniden veri çek
  useFocusEffect(
    useCallback(() => {
      fetchPlayerData();
    }, [])
  );

  // 🧮 player değişince istatistik çek
  useEffect(() => {
    fetchStats();
  }, [player]);

  const handleLeaveTeam = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token || !player?.id) {
    Alert.alert('❌ Hata', 'Giriş yapılmamış veya oyuncu bilgisi eksik.');
    return;
  }

  Alert.alert(
    'Emin misiniz?',
    'Takımdan ayrılmak istediğinize emin misiniz?',
    [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Ayrıl',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`http://10.0.2.2:5275/api/TeamMembers/leave/${player.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert('✅ Takımdan ayrıldınız');
            setPlayer({ ...player, teamId: null, teamName: null });
          } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
              Alert.alert('⚠️ Hata', error.response.data);
              return;
            }

            console.warn('leave/{playerId} başarısız, fallback denenecek...', error);

            // Fallback yöntemi
            try {
              const res = await axios.get('http://10.0.2.2:5275/api/TeamMembers', {
                headers: { Authorization: `Bearer ${token}` },
              });
              const membership = res.data.find((m: any) => m.playerId === player.id);

              if (!membership) {
                Alert.alert('❌ Hata', 'Takım üyeliği bulunamadı.');
                return;
              }

              await axios.delete(`http://10.0.2.2:5275/api/TeamMembers/${membership.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              Alert.alert('✅ Takımdan ayrıldınız (alternatif yöntem)');
              setPlayer({ ...player, teamId: null, teamName: null });
            } catch (fallbackError) {
              console.error('Fallback başarısız:', fallbackError);
              Alert.alert('❌ Hata', 'Takımdan ayrılamadınız. Lütfen tekrar deneyin.');
            }
          }
        },
      },
    ]
  );
};


  // Takıma katıl ekranına git
  const handleJoinTeam = () => {
    if (userId) {
      navigation.navigate('TeamList', { userId });
    } else {
      Alert.alert("Hata", "Kullanıcı bilgisi alınamadı.");
    }
  };
    if (loading) {
    return <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />;
  }

  if (!player) {
    return (
      <View style={styles.container}>
        <Text style={styles.warning}>❌ Oyuncu profili bulunamadı.</Text>
        <Button
          title="Profil Oluştur"
          onPress={() => navigation.replace('CompletePlayerProfile')}
        />
      </View>
    );
  }

  const formattedDate = new Date(player.createAd).toLocaleDateString('tr-TR');

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>👤 Oyuncu Profilim</Text>

      <View style={styles.infoCard}>
        <Text><Text style={styles.label}>Ad:</Text> {player.firstName} {player.lastName}</Text>
        <Text><Text style={styles.label}>Pozisyon:</Text> {player.position || 'Belirtilmemiş'}</Text>
        <Text><Text style={styles.label}>Seviye:</Text> {player.skillLevel}</Text>
        <Text><Text style={styles.label}>Rating:</Text> {player.rating}</Text>
        <Text><Text style={styles.label}>Email:</Text> {player.email}</Text>
        <Text><Text style={styles.label}>Kayıt Tarihi:</Text> {formattedDate}</Text>
        <Text><Text style={styles.label}>Takım:</Text> {player.teamName || 'Takımsız'}</Text>
      </View>

      {player.teamId ? (
        <Button title="Takımdan Ayrıl" color="red" onPress={handleLeaveTeam} />
      ) : (
        <Button title="Takıma Katıl" color="#2E7D32" onPress={handleJoinTeam} />
      )}

      <View style={{ marginTop: 10 }} />
      <Button title="📅 Maçlarım" color="#1976D2" onPress={() => navigation.navigate('MyMatches')} />
      <View style={{ marginTop: 10 }} />
      <Button title="📨 Gelen Teklifler" color="#FFA000" onPress={() => navigation.navigate('MyOffers')} />
      <View style={{ marginTop: 10 }} />
      <Button title="👥 Oyuncular Listesi" color="#6A1B9A" onPress={() => navigation.navigate('PlayerList')} />
        <View style={{ marginTop: 10 }} />
<Button title="🛠 Profilimi Düzenle" color="#00796B" onPress={() => navigation.navigate('EditPlayerProfile')} />
  <View style={styles.statsCard}>
  <Text style={styles.statsTitle}>📊 İstatistiklerim:</Text>
  <Text>🎮 Maç Sayısı: {stats.totalMatches}</Text>
  <Text>📨 Gelen Teklifler: {stats.totalOffers}</Text>
  <Text>📈 Ortalama Puan: {stats.averageRating.toFixed(1)}</Text>
  <Text>📅 Takım Üyeliği: {stats.membershipDays} gün</Text>
</View>
<BarChart
  data={{
    labels: ['Maç', 'Teklif', 'Puan', 'Üyelik'],
    datasets: [
      {
        data: [
          stats.totalMatches,
          stats.totalOffers,
          stats.averageRating,
          stats.membershipDays,
        ],
      },
    ],
  }}
  width={Dimensions.get('window').width - 40}
  height={220}
  fromZero
  yAxisLabel=""
  yAxisSuffix="" // 👉 BU SATIR HATAYI ÇÖZER
  chartConfig={{
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: () => '#000',
    style: {
      borderRadius: 16,
    },
  }}
  style={{
    marginVertical: 10,
    borderRadius: 16,
  }}
/>
<Button
  title="💬 Yorumlarım"
  color="#9C27B0"
  onPress={() => navigation.navigate('MyReviews')}
/>





    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  infoCard: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  label: { fontWeight: 'bold' },
  warning: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16
  },
  statsCard: {
  backgroundColor: '#f1f8e9',
  padding: 15,
  borderRadius: 10,
  marginTop: 10,
},
statsTitle: {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 8,
}

});
export default PlayerProfileScreen;

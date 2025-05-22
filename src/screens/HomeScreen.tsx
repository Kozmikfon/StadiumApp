import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, Alert, Modal, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // ⭐ Bunu unutma!

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }: any) => {
  const sliderData = [
    { id: '1', title: '📊 Maç İstatistiklerini Gir', screen: 'MatchStats' },
    { id: '2', title: '📝 Maça Yorum Yap', screen: 'MyMatches' },
    { id: '3', title: '✔️ Katılım Durumunu Belirt', screen: 'MarkAttendance' }
  ];

  const [profileVisible, setProfileVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  // Player futbol bilgileri:
  const [position, setPosition] = useState('');
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [teamName, setTeamName] = useState('');

  // JWT'den bilgileri çekelim:
  useEffect(() => {
    const getUserInfo = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decoded: any = jwtDecode(token);
      console.log("✅ JWT Bilgileri:", decoded);

      setEmail(decoded.sub);
      const roleFromJwt = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
      setRole(roleFromJwt);

      const userId = decoded.userId;

      if (decoded.firstName && decoded.lastName) {
        setUserName(`${decoded.firstName} ${decoded.lastName}`);
      } else {
        try {
          const userResponse = await axios.get(`http://10.0.2.2:5275/api/Users/${userId}`);
          const user = userResponse.data;
          setUserName(`${user.firstName} ${user.lastName}`);
        } catch (error) {
          console.log("❌ Kullanıcı bilgileri alınamadı", error);
          setUserName("Bilinmiyor");
        }
      }

      // 🟢 ROL kontrolü olmadan her zaman player bilgisi çek
      try {
        const playerResponse = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`);
        const player = playerResponse.data;

        setPosition(player.position || 'Belirtilmedi');
        setSkillLevel(
          player.skillLevel !== null && player.skillLevel !== undefined
            ? player.skillLevel.toString()
            : 'Belirtilmedi'
        );
        setRating(
          player.rating !== null && player.rating !== undefined
            ? player.rating
            : 0
        );
        setTeamName(player.teamName || 'Takımsız');

        console.log("✅ Oyuncu bilgileri çekildi:", player);
      } catch (error) {
        console.log("❌ Oyuncu bilgileri çekilemedi:", error);
        Alert.alert(
          "Profil Eksik",
          "Futbol bilgilerin eksik. Profilini tamamlaman gerekiyor.",
          [
            {
              text: "Tamam",
              onPress: () => navigation.replace('CompletePlayerProfile')
            }
          ]
        );
      }
    };

    getUserInfo();
  }, []);

  // Çıkış fonksiyonu:
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

    return (
        <ScrollView contentContainerStyle={styles.container}>

             {/* NAVBAR */}
           <View style={styles.navbar}>
  <View>
    <Text style={styles.navbarTitle}>🏟️ Stadyum</Text>
    
    {/* Bilgi Yazısı */}
    <Text style={styles.tournamentText}>
      Turnuvaya katılmak için sende yerini al
    </Text>

    {/* Buton */}
    <TouchableOpacity
      style={styles.joinTournamentButton}
      onPress={() => navigation.navigate('Turnuva')}
    >
      <Text style={styles.joinTournamentText}>➕ Turnuvaya Katıl</Text>
    </TouchableOpacity>
  </View>

  {/* Profil Butonu */}
  <TouchableOpacity
    style={styles.profileButton}
    onPress={() => setProfileVisible(true)}
  >
    <Text style={{ color: 'white', fontWeight: 'bold' }}>👤 Profil</Text>
  </TouchableOpacity>
</View>



            {/* Banner */}
            <LinearGradient colors={['#0a2a6c', '#3a7bd5', '#00d2ff']} style={styles.banner}>
                <Image
                    source={{ uri: 'https://yandex-images.clstorage.net/1vR00W318/f09e04573WNY/...' }}
                    style={styles.bannerImage}
                />
            </LinearGradient>
            <Button
  title="🤝 Takım Karşılaştır"
  onPress={() => navigation.navigate('SelectTeam1')}
/>

            {/* Grid Kartlar */}
            <View style={styles.gridRow}>
                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('MatchList')}>
                    <Text style={styles.gridIcon}>🗓️</Text>
                    <Text style={styles.gridText}>Maçlar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('TeamList')}>
                    <Text style={styles.gridIcon}>🏆</Text>
                    <Text style={styles.gridText}>Takımlar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('PlayerList')}>
                    <Text style={styles.gridIcon}>👥</Text>
                    <Text style={styles.gridText}>Oyuncular</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gridItem} onPress={() => Alert.alert('Sahalar')}>
                    <Text style={styles.gridIcon}></Text>
                    <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MatchCalendar')}
      >
        <Text style={styles.cardTitle}>📅 Maç Takvimi</Text>
        <Text>Haftalık maç takvimini görüntüle</Text>
      </TouchableOpacity>
                </TouchableOpacity>
            </View>

            {/* Maç Ara */}
            <Text style={styles.sliderTitle}>⚽ Maç Seçenekleri</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => navigation.navigate('MatchList', { filter: 'today' })}
                >
                    <Text style={styles.buttonText}>🏟️ Bugünkü Maçlar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => navigation.navigate('MatchList', { filter: 'week' })}
                >
                    <Text style={styles.buttonText}>📅 Haftalık Maçlar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => navigation.navigate('MatchList', { filter: 'all' })}
                >
                    <Text style={styles.buttonText}>🔎 Tüm Maçlar</Text>
                </TouchableOpacity>
            </View>

            {/* Slider - Haftanın Maçı / Oyuncusu */}
            <Text style={styles.sliderTitle}>📢 Haftanın Öne Çıkanları</Text>
            <FlatList
  horizontal
  data={sliderData}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.sliderItem}
      onPress={() => navigation.navigate(item.screen, { matchId: /* buraya uygun matchId */ 1 })}
    >
      <Text style={styles.sliderText}>{item.title}</Text>
    </TouchableOpacity>
  )}
  showsHorizontalScrollIndicator={false}
/>
         
            {/* Modal Profil */}
              <Modal
  animationType="slide"
  transparent={true}
  visible={profileVisible}
  onRequestClose={() => setProfileVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.modalTitle}>👤 Kullanıcı Bilgileri</Text>
        <Text>Ad Soyad: {userName}</Text>
        <Text>Email: {email}</Text>
        <Text>Rol: {role}</Text>

        {(role === 'Player' || role === 'User') && (
          <>
<Text>Pozisyon: {position}</Text>
<Text>Seviye: {skillLevel}</Text>



            <TouchableOpacity
              style={styles.completeButtons}
              onPress={() => {
                setProfileVisible(false);
                navigation.navigate('PlayerProfile');
              }}
            >
              <Text style={{ color: 'white' }}>👤 Profili Aç</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.logoutButtons} onPress={handleLogout}>
          <Text style={{ color: 'white' }}>🔓 Çıkış Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setProfileVisible(false)}>
          <Text style={{ marginTop: 10, color: '#1976D2' }}>Kapat</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  </View>
</Modal>






        </ScrollView>
    );
};

// Styles (aynı kalabilir senin öncekilerle)
const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#0a2a6c',
  },
  navbarTitle: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
  },
  tournamentText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 50,
    marginBottom: 6,
  },
  joinTournamentButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  joinTournamentText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  banner: {
    padding: 20,
    alignItems: 'center',
  },
  bannerImage: {
    width: screenWidth - 40,
    height: 200,
    borderRadius: 16,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  gridItem: {
    backgroundColor: '#fff',
    width: screenWidth / 2 - 30,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gridIcon: {
    fontSize: 32,
  },
  gridText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  buttonRow: {
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sliderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginVertical: 15,
  },
  sliderItem: {
    backgroundColor: '#fff',
    width: screenWidth - 60,
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  sliderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 16,
    width: '85%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
  },
  completeButtons: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtons: {
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
});


export default HomeScreen;



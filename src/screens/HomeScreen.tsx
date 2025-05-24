import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, Alert, Modal, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; 
import * as Animatable from 'react-native-animatable';


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
  <Animatable.View animation="fadeInLeft" delay={100} duration={600}>
    <Text style={styles.navbarTitle}>🏟️ Stadyum</Text>

    <Text style={styles.tournamentText}>
      Turnuvaya katılmak için sende yerini al
    </Text>

    <TouchableOpacity
      style={styles.joinTournamentButton}
      onPress={() => navigation.navigate('Turnuva')}
    >
      <Text style={styles.joinTournamentText}> Turnuvaya Katıl</Text>
    </TouchableOpacity>
  </Animatable.View>

  <Animatable.View animation="fadeInRight" delay={300} duration={600}>
    <TouchableOpacity
    
      style={styles.profileButton}
      onPress={() => setProfileVisible(true)}
    >
      <Text style={{ color: 'white', fontWeight: 'bold',fontSize:20 }}>👤</Text>
    </TouchableOpacity>
  </Animatable.View>
</View>




            {/* Banner */}
            
          <View style={styles.banne}>
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

                <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('MatchCalendar')}>
                    <Text style={styles.gridIcon}>📅 </Text>
                    <Text style={styles.gridText}>Maç Takvimi</Text>
                </TouchableOpacity>
            </View>
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
                <TouchableOpacity
  style={styles.compareButton}
  onPress={() => navigation.navigate('SelectTeam1')}
>
  <Text style={styles.compareButtonText}>🤝 Takım Karşılaştır</Text>
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
  alignItems: 'center',
  paddingTop: 50,
  paddingBottom: 20,
  paddingHorizontal: 24,
  backgroundColor: '#004d40', // koyu zümrüt yeşili gibi
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 8,
},
banne:{
  backgroundColor: '#E6E3D3', // açık mavi
},

navbarTitle: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#ffffff',
  textShadowColor: 'rgba(17, 17, 17, 0.35)', // yumuşak gri ton
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3,
  letterSpacing: 0.5,
},

  tournamentText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 45,
    marginBottom: 10,
    marginLeft:5,
  },
  joinTournamentButton: {
    backgroundColor: '#EF9B0F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop:1,
  },
  joinTournamentText: {
    color: '#f8f8ff',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    fontSize: 16,
  },
  profileButton: {
    
    backgroundColor: '#004d40',
    
    padding:10,
    
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 119,
  },
  banner: {
    padding: 20,
    alignItems: 'center',
  },
bannerImage: {
  width: screenWidth - 40,
  height: 140,
  borderRadius: 16,
  resizeMode: 'cover',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
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
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom:6,
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
    padding: 19,
    borderRadius: 19,
    marginBottom: 22,
    marginTop: 0,
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
  compareButton: {
  backgroundColor: '#1976D2',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 25,
  alignSelf: 'center',
  marginTop: 16,
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},

compareButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

 
});
export default HomeScreen;



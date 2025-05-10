import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, Alert, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; // ⭐ Bunu unutma!

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }: any) => {

    const sliderData = [
        { id: '1', title: 'Haftanın Maçı: Zaptolmazlar vs Sarsılmazlar' },
        { id: '2', title: 'Haftanın Oyuncusu: Ali Yılmaz - Forvet' },
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
          if (token) {
              const decoded: any = jwtDecode(token);
              console.log("✅ JWT Bilgileri:", decoded);
  
              setUserName(decoded.firstName + ' ' + decoded.lastName);
              setEmail(decoded.sub);
              setRole(decoded.role);
  
              const userId = decoded.userId;
  
              if (decoded.role === 'Player') {
                  try {
                      const playerResponse = await axios.get(`http://10.0.2.2:5275/api/Players/user/${userId}`);
                      const player = playerResponse.data;
  
                      setPosition(player.position || 'Belirtilmedi');
                      setSkillLevel(player.skillLevel?.toString() || 'Belirtilmedi');
                      setRating(player.rating ?? 0);
                      setTeamName(player.teamName || 'Takımsız');
  
                      console.log("✅ Oyuncu bilgileri çekildi:", player);
  
                  } catch (error: any) {
                      console.log('❌ Oyuncu bilgileri çekilemedi:', error);
  
                      // Eğer oyuncu kaydı yoksa direkt profil tamamlama ekranına yönlendir:
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
              }
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
                <Text style={styles.navbarTitle}>🏟️ Stadyum</Text>
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
                    <Text style={styles.gridIcon}>🏟️</Text>
                    <Text style={styles.gridText}>Sahalar</Text>
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
                    <View style={styles.sliderItem}>
                        <Text style={styles.sliderText}>{item.title}</Text>
                    </View>
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
      <Text style={styles.modalTitle}>👤 Kullanıcı Bilgileri</Text>
      <Text>Ad Soyad: {userName}</Text>
      <Text>Email: {email}</Text>
      <Text>Rol: {role}</Text>

      {role === 'Player' && (
        <>
          <Text>Pozisyon: {position || 'Belirtilmedi'}</Text>
          <Text>Seviye: {skillLevel || '0'}</Text>
          <Text>Rating: {rating || '0'}</Text>
        </>
      )}

      {role === 'Player' && (
  position === 'Belirtilmedi' || !position || parseInt(skillLevel || '0') === 0
) && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => {
            setProfileVisible(false);
            navigation.navigate('CompletePlayerProfile');
          }}
        >
          <Text style={{ color: 'white' }}>⚽ Profilini Tamamla</Text>
        </TouchableOpacity>
      )}

      {role === 'Player' && (
        <TouchableOpacity
          style={styles.completeButtons}
          onPress={() => {
            setProfileVisible(false);
            navigation.navigate('PlayerProfile');
          }}
        >
          <Text style={{ color: 'white' }}>👤 Profili Aç</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.logoutButtons}
        onPress={handleLogout}
      >
        <Text style={{ color: 'white' }}>🔓 Çıkış Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setProfileVisible(false)}>
        <Text style={{ marginTop: 10, color: '#1976D2' }}>Kapat</Text>
      </TouchableOpacity>
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
        backgroundColor: '#f5f5f5',
    },
    infoText: {
      fontSize: 16,
      marginBottom: 5,
      textAlign: 'center'
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
},

  
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0a2a6c',
        marginTop: 10,
    },
    navbarTitle: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    profileButton: {
        backgroundColor: '#1976D2',
        padding: 8,
        borderRadius: 20,
    },
    banner: {
        padding: 20,
        alignItems: 'center',
    },
    bannerImage: {
        width: screenWidth - 40,
        height: 200,
        borderRadius: 10,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    gridItem: {
        backgroundColor: '#fff',
        width: screenWidth / 2 - 30,
        height: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    gridIcon: {
        fontSize: 30,
    },
    gridText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 5,
    },
    buttonRow: {
        marginHorizontal: 20,
        marginBottom: 10,
    },
    searchButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sliderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginBottom: 10,
    },
    sliderItem: {
        backgroundColor: '#fff',
        width: screenWidth - 60,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 10,
        elevation: 2,
    },
    sliderText: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
},
modalContent: {
  backgroundColor: '#fff',
  padding: 25,
  borderRadius: 12,
  width: '80%',
  alignItems: 'center'
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 15
},
completeButtons: {
  backgroundColor: '#2E7D32',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginTop: 15
},
logoutButtons: {
  backgroundColor: '#D32F2F',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginTop: 15
}

});

export default HomeScreen;
function setTeamName(arg0: string) {
  throw new Error('Function not implemented.');
}


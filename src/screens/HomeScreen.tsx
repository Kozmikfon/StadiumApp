import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }: any) => {

  const sliderData = [
    { id: '1', title: 'Haftanın Maçı: Zaptolmazlar vs Sarsılmazlar' },
    { id: '2', title: 'Haftanın Oyuncusu: Ali Yılmaz - Forvet' },
  ];

  // 👤 Profil menüsünü aç/kapat kontrolü
  const [showProfile, setShowProfile] = useState(false);

  // Çıkış fonksiyonu
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>🏟️ Stadyum</Text>
        <TouchableOpacity onPress={() => setShowProfile(!showProfile)}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Profil Menüsü */}
      {showProfile && (
        <View style={styles.profileMenu}>
          <Text style={styles.profileText}>Ad: Ali Yılmaz</Text>
          <Text style={styles.profileText}>Email: ali@example.com</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🔓 Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      )}

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
    onPress={() => navigation.navigate('MatchList', { filter: 'today' })} // Bugünkü maçlar
  >
    <Text style={styles.buttonText}>🏟️ Bugünkü Maçlar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.searchButton}
    onPress={() => navigation.navigate('MatchList', { filter: 'week' })} // Haftalık maçlar
  >
    <Text style={styles.buttonText}>📅 Haftalık Maçlar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.searchButton}
    onPress={() => navigation.navigate('MatchList', { filter: 'all' })} // Tüm maçlar
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

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    backgroundColor: '#f5f5f5',
    
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
    fontWeight: 'bold'
    
  },
  profileIcon: {
    fontSize: 28,
    color: 'white'
  },
  profileMenu: {
    backgroundColor: '#ffffff',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    elevation: 2
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#c62828',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold'
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
    fontSize: 16
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
});

export default HomeScreen;

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Alert } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }: any) => {

  const sliderData = [
    { id: '1', title: 'Haftanın Maçı: Zaptolmazlar vs Sarsılmazlar' },
    { id: '2', title: 'Haftanın Oyuncusu: Ali Yılmaz - Forvet' },
  ];

  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <LinearGradient colors={['#0a2a6c', '#3a7bd5', '#00d2ff']} style={styles.banner}>
        <Text style={styles.bannerTitle}>🏟️ Stadyum</Text>
        <Image
          source={{ uri: 'https://yandex-images.clstorage.net/1vR00W318/f09e04573WNY/KW-lPf-shwREMXRGzDUU3agFkzUo7mPowncusIpKJIdeeOMh4zbXdKmNeUQxgkgjhbKuozb5ilfpG0H_qqgXrX07YUn-KcLQRZQ0xvxlNQh8NILwiKuyTOey6iUfP7TnCMt0RsR1MOKen05WlWdt1uBzfzZTXDu2nT3nToxcERrorSRemywFVdAgRHV-1zUrCfcRMTtpoljW4IlRvUqBkrnJJ8TF1BJSvowN1mYX38fiQilncUzdRS5dBxvvHEC4urw3f5p_VBezkWaWjpREy5r0wtFZ2KOYxfKLkk1LI6E4qFalVqZzQ6w8LjamJG60MKOJtLN8jkWeTWerr-0i6IpMxs76DwYH8nH05401VPmJ5xADm2gziBVACIKfqhGgyYhkNvU0Y2Afrn3mtMf9RJERyYbBnlxU7kylqD38cshKj9Z96xwUZyJDhKSNdHTLytdi4klZ8hvXUrhRvegwYpkoxTR1dGDjPW4tpxQn3DQAgcs2IL2-9l0sJjuMv6OoyMz0PKpfJDXz0AcFb1fH6dhl0IGLGMEIFZMaY53LwaIre-QFxuawoI48X4fkx8w0ISJpVpMMD5VODrSrzV_w-hjtJp9oTEcW8aCGN6xXFRtrZlLgyJlhSBeDGCEtmEFSu6sk9AVUc1F-f0wHJ9c_1eNguEbAzM0W_v0Uii_MAOlq_SbsKY1E5iKCVoQ-FBQJiKfQw6q5omkkg0tij8sAcRsZ9tR25tJB_58MZ1bWbxejcJlU0g2fFl5PJgqsLwDoSK9GzckdFYYQcnSmHrW0SyvU8xNYi0JZljE6cz978rK7uhZ2J9YjQ54_j5SE5Rwl0TBqhRMevNUu31ZITI4jKajuNO9oPLTHYEF2xa8GZfrpdyESiAoQOBbRuKCfWqCSy4v1xXV2U7NdPlzXF_dPBDOwOvRC3c_V730Uqx080isaHWZcmbwFtyIzRMWOFQeK2jfR8aoY0kpFEtpwI' }}
          style={styles.bannerImage}
        />
      </LinearGradient>

      {/* Grid Kartlar */}
      <View style={styles.gridRow}>

      <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Login')}>
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
        <TouchableOpacity style={styles.gridItem} onPress={() => alert('Sahalar')}>
          <Text style={styles.gridIcon}>🏟️</Text>
          <Text style={styles.gridText}>Sahalar</Text>
        </TouchableOpacity>
      </View>

      {/* Maç Ara */}
      <Text style={styles.sliderTitle}>⚽ Maç Seçenekleri</Text>
<View style={styles.buttonRow}>
    <TouchableOpacity style={styles.searchButton} onPress={() => alert('Bugünkü Maçlar')}>
        <Text style={styles.buttonText}>🏟️ Bugünkü Maçlar</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.searchButton} onPress={() => alert('Haftalık Maçlar')}>
        <Text style={styles.buttonText}>📅 Haftalık Maçlar</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.searchButton} onPress={() => alert('Tüm Maçlar')}>
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

  container: {
    paddingBottom: 20,
    backgroundColor: '#f5f5f5'
  },
  banner: {
    padding: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
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
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  searchInput: {
    height: 40,
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

import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/props/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {

  // Şimdilik sabit veri. İleride API'den çekeceğiz.
  const upcomingMatches = [
    { id: '1', title: 'Zaptolmazlar vs Sarsılmazlar', date: '05 Mayıs 2025' },
    { id: '2', title: 'SivasBelediye vs Kartallar', date: '12 Mayıs 2025' },
  ];

  function alert(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <LinearGradient colors={["#2E7D32", "#4CAF50"]} style={styles.header}>
        <Text style={styles.headerText}>Hoş Geldin!</Text>
        <Text style={styles.dateText}>Bugün: 1 Mayıs 2025</Text>
      </LinearGradient>

      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => alert('Maçlar yakında')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/889/889442.png' }} style={styles.icon} />
          <Text style={styles.cardText}>Maçlar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => alert('Takımlar yakında')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }} style={styles.icon} />
          <Text style={styles.cardText}>Takımlar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PlayerList')}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/847/847842.png' }} style={styles.icon} />
          <Text style={styles.cardText}>Oyuncular</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Yaklaşan Maçlar</Text>
        <FlatList
          data={upcomingMatches}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.matchCard}>
              <Text style={styles.matchTitle}>{item.title}</Text>
              <Text style={styles.matchDate}>{item.date}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>🏅 Haftanın Maçı</Text>
        <Text>Zaptolmazlar vs Sarsılmazlar</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>🌟 Haftanın Oyuncusu</Text>
        <Text>Ali Yılmaz - Forvet</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  dateText: {
    fontSize: 14,
    color: "white",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: 100,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  matchCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  matchDate: {
    color: "#555",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
});

export default HomeScreen;

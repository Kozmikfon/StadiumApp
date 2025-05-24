import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PlayerDetail = ({ route }: any) => {
  const { player } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
  <View style={styles.headerBox}>
    <Text style={styles.title}>👤 {player.firstName} {player.lastName}</Text>
    <Text style={styles.subText}>Oyuncu Detayları</Text>
  </View>

  <View style={styles.infoCard}>
    <Text style={styles.label}>📧 Email</Text>
    <Text style={styles.value}>{player.email}</Text>
  </View>

  <View style={styles.infoCard}>
    <Text style={styles.label}>🧭 Pozisyon</Text>
    <Text style={styles.value}>{player.position || 'Belirtilmemiş'}</Text>
  </View>

  <View style={styles.infoCard}>
    <Text style={styles.label}>⚡ Yetenek Seviyesi</Text>
    <Text style={styles.value}>{player.skillLevel || 'Belirtilmemiş'}</Text>
  </View>

  <View style={styles.infoCard}>
    <Text style={styles.label}>⭐ Rating</Text>
    <Text style={styles.value}>{player.rating || 'Belirtilmemiş'}</Text>
  </View>

  <View style={styles.infoCard}>
    <Text style={styles.label}>🏆 Takım</Text>
    <Text style={styles.value}>{player.teamName || 'Takım yok'}</Text>
  </View>
</ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e3f2fd',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 25,
    padding: 16,
    backgroundColor: '#0d47a1',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subText: {
    fontSize: 14,
    color: '#bbdefb',
    marginTop: 6,
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: '#607d8b',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 17,
    color: '#263238',
    fontWeight: '500',
  },
});


export default PlayerDetail;

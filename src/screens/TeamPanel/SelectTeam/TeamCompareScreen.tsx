import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/props/types';

const TeamCompareScreen = ({ route }: any) => {
  const { team1Id, team2Id } = route.params;
  const [comparison, setComparison] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    axios.get(`http://10.0.2.2:5275/api/Teams/compare/${team1Id}/${team2Id}`)
      .then(res => setComparison(res.data))
      .catch(err => console.error('❌ Karşılaştırma alınamadı:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Takım Karşılaştırması</Text>
      {comparison.map((team, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.teamName}>{team.teamName}</Text>
          <Text>🎮 Oynanan Maç: {team.totalMatches}</Text>
          <Text>📈 Ortalama Puan: {team.averageRating}</Text>
        </View>
      ))}

      {/* 📊 Sıralama Butonu */}
      <Button
        title="🏆 Takım Sıralaması"
        onPress={() => navigation.navigate('TopTeams')}
        color="#388E3C"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#f1f8e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  }
});

export default TeamCompareScreen;

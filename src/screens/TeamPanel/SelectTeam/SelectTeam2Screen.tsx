import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SelectTeam2Screen = ({ route, navigation }: any) => {
  const { team1Id } = route.params;
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://10.0.2.2:5275/api/Teams')
      .then(res => setTeams(res.data.filter((t: any) => t.id !== team1Id)))
      .catch(err => console.error('❌ Takımlar alınamadı:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>2️⃣ İkinci Takımı Seçin</Text>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TeamCompare', {
              team1Id,
              team2Id: item.id
            })}
          >
            <Text style={styles.teamName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  teamName: { fontSize: 18 }
});

export default SelectTeam2Screen;

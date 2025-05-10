import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const TeamList = ({ navigation }: any) => {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const route = useRoute<any>();
    const { userId } = route.params || {};

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:5275/api/Teams');
                setTeams(response.data);
            } catch (error) {
                console.error('❌ Takımlar alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const handleJoin = async (teamId: number) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const decoded: any = jwtDecode(token || '');
    const userId = decoded.userId;

    // 1️⃣ Önce userId'den playerId'yi al
    const playerRes = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`);
    const playerId = playerRes.data.id;

    // 2️⃣ Oyuncu zaten bir takıma katılmış mı kontrol et
    const checkRes = await axios.get(`http://10.0.2.2:5275/api/TeamMembers`);
    const alreadyMember = checkRes.data.find((tm: any) => tm.playerId === playerId);

    if (alreadyMember) {
      Alert.alert("⚠️ Zaten bir takımdasınız", "Başka bir takıma katılamazsınız.");
      return;
    }

    // 3️⃣ Takıma katıl isteği gönder
    await axios.post('http://10.0.2.2:5275/api/TeamMembers', {
      teamId,
      playerId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Alert.alert("✅ Başarılı", "Takıma katıldınız!");
    navigation.replace('PlayerProfile');

  } catch (error: any) {
    console.error("❌ Katılım hatası:", error);
    Alert.alert("Hata", "Takıma katılamadınız.");
  }
};



    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tüm Takımlar</Text>
            <FlatList
                data={teams}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.teamCard}>
                        <TouchableOpacity
                            onPress={() => {
                                console.log("➡ Navigasyon teamId:", item.id);
                                navigation.navigate('TeamDetail', { teamId: item.id });
                            }}
                        >
                            <Text style={styles.teamName}>🏆 {item.name}</Text>
                            <Text>Kaptan: {item.captain ? `${item.captain.firstName} ${item.captain.lastName}` : 'Belirtilmemiş'}</Text>
                            <Text>Oyuncu Sayısı: {item.players ? item.players.length : 0}</Text>
                        </TouchableOpacity>

                        {true && (
  <TouchableOpacity
    style={styles.joinButton}
    onPress={() => handleJoin(item.id)}
  >
    <Text style={styles.joinButtonText}>Takıma Katıl</Text>
  </TouchableOpacity>
)}

                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    teamCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3
    },
    teamName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    joinButton: {
        marginTop: 10,
        backgroundColor: '#2E7D32',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    joinButtonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

export default TeamList;

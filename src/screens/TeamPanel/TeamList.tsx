import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity ,} from 'react-native';
import axios from 'axios';

const TeamList = ({navigation}:any) => {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
            <TouchableOpacity
                style={styles.teamCard}
                
                onPress={() => {
                    console.log("➡ Navigasyon teamId:", item.id);
                    navigation.navigate('TeamDetail', { teamId: item.id });
                }}
            >
                <Text style={styles.teamName}>🏆 {item.name}</Text>
                <Text>Kaptan: {item.captain ? `${item.captain.firstName} ${item.captain.lastName}` : 'Belirtilmemiş'}</Text>
                <Text>Oyuncu Sayısı: {item.players ? item.players.length : 0}</Text>
            </TouchableOpacity>
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
    }
});

export default TeamList;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const PlayerList = ({ navigation }: any) => {  // 👈 navigation propsunu ekledim
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:5275/api/Players');
                setPlayers(response.data);
            } catch (error) {
                console.error('❌ Oyuncular alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tüm Oyuncular</Text>
            <FlatList
                data={players}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.playerCard}
                        onPress={() => navigation.navigate('PlayerDetail', { player: item })}  // 👈 Detay sayfasına yönlendir
                    >
                        <Text style={styles.playerName}>{item.firstName} {item.lastName}</Text>
                        <Text>Pozisyon: {item.position || 'Belirtilmemiş'}</Text>
                        <Text>Skill Level: {item.skillLevel || '-'}</Text>
                        <Text>Rating: {item.rating || '-'}</Text>
                        <Text>Takım: {item.teamName ?? "Takımsız"}</Text>
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
    playerCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default PlayerList;

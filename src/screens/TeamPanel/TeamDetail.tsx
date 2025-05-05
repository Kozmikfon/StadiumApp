import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const TeamDetail = ({ route }: any) => {
    const { teamId } = route.params;
    const [team, setTeam] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("✅ TeamDetail ekranı açıldı, teamId:", teamId);

        const fetchTeam = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:5275/api/Teams/${teamId}`);
                console.log("📌 Gelen takım verisi:", response.data);
                setTeam(response.data);
            } catch (error) {
                console.error('❌ Takım bilgisi alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [teamId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    if (!team) {
        return <Text>Takım bilgisi bulunamadı.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏆 {team.name}</Text>
            <Text style={styles.subtitle}>
                Kaptan: {team.captain ? `${team.captain.firstName} ${team.captain.lastName}` : 'Belirtilmemiş'}
            </Text>

            <Text style={styles.subtitle}>Oyuncular:</Text>
            <FlatList
                data={team.players}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.playerCard}>
                        <Text>{item.firstName} {item.lastName} ({item.position})</Text>
                        <Text>Skill: {item.skillLevel} | Rating: {item.rating}</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10
    },
    playerCard: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8
    }
});

export default TeamDetail;

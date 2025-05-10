import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const MatchList = ({ navigation }: any) => {
    const route = useRoute<any>();
    const { filter } = route.params || {};
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:5275/api/Matches');

                let filteredMatches = response.data;

                if (filter === 'today') {
                    const today = new Date().toISOString().split('T')[0];
                    filteredMatches = response.data.filter((m: any) =>
                        new Date(m.matchDate).toISOString().startsWith(today)
                    );
                } else if (filter === 'week') {
                    const today = new Date();
                    const weekEnd = new Date();
                    weekEnd.setDate(today.getDate() + 7);

                    filteredMatches = response.data.filter((m: any) => {
                        const matchDate = new Date(m.matchDate);
                        return matchDate >= today && matchDate <= weekEnd;
                    });
                }

                setMatches(filteredMatches);
            } catch (error) {
                console.error('❌ Maçlar alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [filter]);

    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚽ Maçlar</Text>

            <Button title="➕ Maç Oluştur" onPress={() => navigation.navigate('CreateMatch')} />

            {matches.length === 0 ? (
                <Text>Maç bulunamadı.</Text>
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.matchCard}>
                            <Text>Maç: {item.team1Name} vs {item.team2Name}</Text>
                            <Text>Saha: {item.fieldName}</Text>
                            <Text>Tarih: {new Date(item.matchDate).toLocaleDateString()}</Text>
                        </View>
                    )}
                />
            )}
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
        marginBottom: 10
    },
    matchCard: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    }
});

export default MatchList;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const PlayerPanel = () => {
    const [playerData, setPlayerData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token bulunamadı');

                const decoded: any = jwtDecode(token);
                const userId = decoded.userId;

                const response = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`);
                setPlayerData(response.data);

            } catch (error) {
                console.error('❌ Oyuncu verisi alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    if (!playerData) {
        return <Text>❗ Oyuncu bilgisi bulunamadı.</Text>;
    }

    // Tarihi daha okunabilir formata çevirelim:
    const formattedDate = new Date(playerData.createAd).toLocaleDateString('tr-TR');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚽ Oyuncu Bilgileri</Text>
            <Text>Ad Soyad: {playerData.firstName} {playerData.lastName}</Text>
            <Text>Email: {playerData.email}</Text>
            <Text>Pozisyon: {playerData.position}</Text>
            <Text>Skill Level: {playerData.skillLevel}</Text>
            <Text>Rating: {playerData.rating}</Text>
            <Text>Kayıt Tarihi: {formattedDate}</Text>
            <Text>Takım: {playerData.teamName ? playerData.teamName : "Takımsız"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    }
});

export default PlayerPanel;

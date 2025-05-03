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
                console.log('📌 Okunan token:', token);

                if (!token) throw new Error('Token bulunamadı');

                const decoded: any = jwtDecode(token);
                const userId = decoded.userId;
                console.log('📌 UserID:', userId);

                // API: userId'ye sahip oyuncuyu getir
                const response = await axios.get(`http://10.0.2.2:5275/api/Players/byUser/${userId}`);
                console.log('📌 Oyuncu verisi:', response.data);

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚽ Oyuncu Bilgileri</Text>
            <Text>Ad Soyad: {playerData.firstName} {playerData.lastName}</Text>
            <Text>Email: {playerData.email}</Text>
            <Text>Pozisyon: {playerData.position || 'Belirtilmemiş'}</Text>
            <Text>Skill Level: {playerData.skillLevel || 'Belirtilmemiş'}</Text>
            <Text>Rating: {playerData.rating || 'Belirtilmemiş'}</Text>
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

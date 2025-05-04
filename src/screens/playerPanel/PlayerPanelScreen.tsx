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
                // 1️⃣ TOKEN'I OKU
                const token = await AsyncStorage.getItem('token');
                console.log('✅ Okunan token:', token);

                if (!token) {
                    throw new Error('Token bulunamadı');
                }

                // 2️⃣ TOKEN'DAN userId AL
                const decoded: any = jwtDecode(token);
                console.log('✅ Decoded Token:', decoded);

                const userId = decoded.userId;
                console.log('✅ UserID:', userId);

                // 3️⃣ BACKEND'DEN PLAYER BİLGİLERİNİ ÇEK
                const response = await axios.get(`http://10.0.2.2:5275/api/Players`);
                console.log('✅ Gelen oyuncular:', response.data);

                // 4️⃣ UserId'ye göre ilgili player'ı bul
                const player = response.data.find((p: any) => p.userId === parseInt(userId));

                if (!player) {
                    console.log('❌ Bu kullanıcıya bağlı bir Player bulunamadı.');
                }

                setPlayerData(player);

            } catch (error) {
                console.error('❌ Player verisi alınamadı:', error);
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
        return <Text>❗ Bu kullanıcıya bağlı oyuncu bulunamadı.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚽ Oyuncu Bilgileri</Text>
            <Text>Ad Soyad: {playerData.firstName} {playerData.lastName}</Text>
            <Text>Email: {playerData.email}</Text>
            <Text>Pozisyon: {playerData.position}</Text>
            <Text>Skill Level: {playerData.skillLevel}</Text>
            <Text>Rating: {playerData.rating}</Text>
            <Text>Takım ID: {playerData.teamId ? playerData.teamId : 'Takım yok'}</Text>
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

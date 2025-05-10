import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PlayerPanelScreen = ({ navigation }: any) => {
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayer = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.replace('Login');
                return;
            }

            const decoded: any = jwtDecode(token);
            const userId = decoded.userId;

            try {
                const response = await axios.get(`http://10.0.2.2:5275/api/Players/user/${userId}`);
                console.log("✅ Oyuncu Bilgileri:", response.data);

                // Futbol bilgilerini kontrol edelim:
                const playerData = response.data;
                if (!playerData.position || !playerData.skillLevel) {
                    // Futbol bilgileri eksik → Profil tamamlama sayfasına yönlendir:
                    navigation.replace('CompletePlayerProfile');
                    return;
                }

                setPlayer(playerData);
            } catch (error) {
                console.error('❌ Oyuncu bilgileri alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayer();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚽ Oyuncu Paneli</Text>
            <Text style={styles.info}>Ad Soyad: {player.firstName} {player.lastName}</Text>
            <Text style={styles.info}>Pozisyon: {player.position}</Text>
            <Text style={styles.info}>Seviye: {player.skillLevel}</Text>
            <Text style={styles.info}>Takım: {player.teamName ?? "Takımsız"}</Text>

            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('CompletePlayerProfile')}
            >
                <Text style={{ color: 'white' }}>Bilgileri Güncelle</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
    editButton: {
        marginTop: 20,
        backgroundColor: '#2E7D32',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});

export default PlayerPanelScreen;

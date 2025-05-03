import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const UserPanel = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🟢 useEffect çalıştı!');
        const fetchUserData = async () => {
            try {
                // 1️⃣ TOKEN'I OKU
                const token = await AsyncStorage.getItem('token');
                console.log('📌 Okunan token:', token);

                if (!token) {
                    throw new Error('Token bulunamadı');
                }

                // 2️⃣ TOKEN'DAN userId AL
                const decoded: any = jwtDecode(token);
                console.log('📌 Decoded Token:', decoded);

                const userId = decoded.userId;
                console.log('📌 UserID:', userId);

                // 3️⃣ BACKEND'DEN USER BİLGİLERİNİ ÇEK
                const response = await axios.get(`http://10.0.2.2:5275/api/Users/${userId}`);
                console.log('📌 Kullanıcı verisi:', response.data);

                setUserData(response.data);

            } catch (error) {
                console.error('❌ Kullanıcı verisi alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    if (!userData) {
        return <Text>❗ Kullanıcı bilgisi bulunamadı.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 Kullanıcı Bilgileri</Text>
            <Text>Ad Soyad: {userData.firstName} {userData.lastName}</Text>
            <Text>Email: {userData.email}</Text>
            <Text>Pozisyon: {userData.position || 'Belirtilmemiş'}</Text>
            <Text>Skill Level: {userData.skillLevel || 'Belirtilmemiş'}</Text>
            <Text>Rating: {userData.rating || 'Belirtilmemiş'}</Text>
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

export default UserPanel;

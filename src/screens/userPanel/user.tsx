import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const UserPanel = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('Token bulunamadı');
                }

                // Token çözülüyor
                const decoded: any = jwtDecode(token);
                console.log('Çözülen JWT:', decoded);  // LOG 1
                const userId = decoded.userId;

                const url = `http://10.0.2.2:5275/api/Users/${userId}`;
                console.log('API isteği URL:', url);  // LOG 2

                const response = await axios.get(url);
                setUserData(response.data);

            } catch (error: any) {
                console.error('Kullanıcı verisi alınamadı:', error);
                setErrorMessage('Kullanıcı bilgisi alınamadı. Lütfen tekrar giriş yapın.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    if (errorMessage) {
        return <Text style={{ color: 'red' }}>{errorMessage}</Text>;
    }

    if (!userData) {
        return <Text>Kullanıcı bilgisi bulunamadı.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 Kullanıcı Bilgileri</Text>
            <Text>Ad Soyad: {userData.firstName} {userData.lastName}</Text>
            <Text>Email: {userData.email}</Text>
            <Text>Pozisyon: {userData.position}</Text>
            <Text>Skill Level: {userData.skillLevel}</Text>
            <Text>Rating: {userData.rating}</Text>
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

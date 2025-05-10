import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const UserPanel = ({ navigation }: any) => {
    const [userData, setUserData] = useState<any>(null);
    const [playerData, setPlayerData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token bulunamadı');

                const decoded: any = jwtDecode(token);
                const userId = decoded.userId;

                // 1️⃣ User verisi çek
                const userResponse = await axios.get(`http://10.0.2.2:5275/api/Users/${userId}`);
                setUserData(userResponse.data);

                // 2️⃣ Player verisi çek
                const playerResponse = await axios.get(`http://10.0.2.2:5275/api/Players`);
                const player = playerResponse.data.find((p: any) => p.userId === userId);
                setPlayerData(player || null);

            } catch (error) {
                console.error('❌ Veriler alınamadı:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#2E7D32" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 Kullanıcı Bilgileri</Text>
            <Text>Ad Soyad: {userData.firstName} {userData.lastName}</Text>
            <Text>Email: {userData.email}</Text>

            {playerData ? (
  (playerData.position && playerData.skillLevel !== 0) ? (
    <>
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>⚽ Oyuncu Bilgileri</Text>
      <Text>Pozisyon: {playerData.position}</Text>
      <Text>Skill Level: {playerData.skillLevel}</Text>
      <Text>Rating: {playerData.rating}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('PlayerProfile')}>
        <Text style={styles.buttonText}>Profilimi Görüntüle</Text>
      </TouchableOpacity>
    </>
  ) : (
    <>
      <Text style={{ marginTop: 20, color: 'orange' }}>
        ⚠️ Oyuncu bilgileriniz eksik. Lütfen tamamlayın.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CompletePlayerProfile')}>
        <Text style={styles.buttonText}>Profilini Tamamla</Text>
      </TouchableOpacity>
    </>
  )
) : (
  <>
    <Text style={{ marginTop: 20, color: 'gray' }}>Henüz oyuncu profiliniz yok.</Text>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CompletePlayerProfile')}>
      <Text style={styles.buttonText}>Oyuncu Profilini Oluştur</Text>
    </TouchableOpacity>
  </>
)}

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
    },
    button: {
        marginTop: 20,
        backgroundColor: '#2E7D32',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    }
});

export default UserPanel;

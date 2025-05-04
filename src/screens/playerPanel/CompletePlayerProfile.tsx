import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const CompletePlayerProfile = ({ navigation }: any) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');
    const [skillLevel, setSkillLevel] = useState('');

    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const getUserIdFromToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decoded: any = jwtDecode(token);
                console.log("📌 Decoded Token:", decoded);
                setUserId(decoded.userId);
                setEmail(decoded.sub); // Email token'ın subject'inde geliyor
            } else {
                Alert.alert('Hata', 'Token bulunamadı. Lütfen tekrar giriş yapın.');
                navigation.navigate('Login');
            }
        };
        getUserIdFromToken();
    }, []);

    const handleSave = async () => {
        if (!firstName || !lastName || !position || !skillLevel) {
            Alert.alert('Hata', 'Tüm alanları doldurun.');
            return;
        }
        
        if (!userId) {
        Alert.alert('Hata', 'Kullanıcı kimliği alınamadı. Lütfen tekrar giriş yapın.');
        return;
        }
    
        try {
            const response = await axios.post('http://10.0.2.2:5275/api/Players', {
                firstName,
                lastName,
                email,
                position,
                skillLevel: parseInt(skillLevel),
                rating: 0,
                createAd: new Date().toISOString(),
                teamId: null,
                userId: userId
            });
    
            console.log("✅ Oyuncu başarıyla kaydedildi:", response.data);
    
            Alert.alert('Başarılı', 'Oyuncu profili tamamlandı!');
            navigation.replace('PlayerPanel');
        } catch (error: any) {
            console.error('❌ Kayıt hatası:', error);
    
            if (error.response) {
                console.log('👉 Sunucu cevabı:', error.response.data);
                Alert.alert('Hata', `Profil kaydedilemedi: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                console.log('👉 Sunucuya istek gönderildi ama yanıt alınamadı.');
                Alert.alert('Hata', 'Sunucuya ulaşılamadı.');
            } else {
                console.log('👉 İstek hazırlanırken hata oluştu:', error.message);
                Alert.alert('Hata', `Bilinmeyen hata: ${error.message}`);
            }
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Oyuncu Profilini Tamamla</Text>

            <TextInput
                placeholder="Ad"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                placeholder="Soyad"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                placeholder="Pozisyon"
                style={styles.input}
                value={position}
                onChangeText={setPosition}
            />
            <TextInput
                placeholder="Yetenek Seviyesi (1-100)"
                style={styles.input}
                keyboardType="numeric"
                value={skillLevel}
                onChangeText={setSkillLevel}
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Kaydet</Text>
            </TouchableOpacity>
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
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15
    },
    button: {
        backgroundColor: '#2E7D32',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default CompletePlayerProfile;

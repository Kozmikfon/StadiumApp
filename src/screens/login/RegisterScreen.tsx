import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }: any) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [position, setPosition] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [rating, setRating] = useState('');

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password) {
            Alert.alert('Hata', 'Tüm alanları doldurun.');
            return;
        }

        try {
            const response = await axios.post('http://10.0.2.2:5275/api/Auth/register', {
                firstName,
                lastName,
                email,
                passwordHash: password,
                position,
                skillLevel: parseInt(skillLevel) || 0,
                rating: parseFloat(rating) || 0
            });

            Alert.alert('Başarılı', 'Kayıt başarılı. Şimdi giriş yapabilirsiniz.');
            navigation.navigate('Login');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Kayıt Hatası', 'Bir hata oluştu. Bilgileri kontrol edin.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kayıt Ol</Text>
            <TextInput placeholder="Ad" style={styles.input} value={firstName} onChangeText={setFirstName} />
            <TextInput placeholder="Soyad" style={styles.input} value={lastName} onChangeText={setLastName} />
            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput placeholder="Şifre" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput placeholder="Pozisyon (örn: Forvet)" style={styles.input} value={position} onChangeText={setPosition} />
            <TextInput placeholder="Yetenek Seviyesi (örn: 80)" style={styles.input} value={skillLevel} onChangeText={setSkillLevel} keyboardType="numeric" />
            <TextInput placeholder="Puan (örn: 4.5)" style={styles.input} value={rating} onChangeText={setRating} keyboardType="decimal-pad" />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
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
        marginBottom: 10
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

export default RegisterScreen;

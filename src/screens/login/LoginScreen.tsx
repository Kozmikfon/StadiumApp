import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Lütfen email ve şifre girin.');
            return;
        }
    
        try {
            const response = await axios.post('http://10.0.2.2:5275/api/Auth/login', {
                email,
                password
            });
    
            // Token'ı kaydet!
            await AsyncStorage.setItem('token', response.data.token);
    
            const { role } = response.data;
    
            if (role === 'Player') {
                navigation.replace('PlayerPanel');
            } else if (role === 'User') {
                navigation.replace('UserPanel');
            } else {
                Alert.alert('Hata', 'Bilinmeyen rol.');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Giriş Başarısız', 'Email veya şifre hatalı.');
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giriş Yap</Text>
            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Şifre"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                 <Text style={{ marginTop: 15, color: '#1976D2' }}>Hesabınız yok mu? Kayıt olun.</Text>
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

export default LoginScreen;

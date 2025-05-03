import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const CompletePlayerProfile = ({ navigation }: any) => {
    const [position, setPosition] = useState('');
    const [skillLevel, setSkillLevel] = useState('');

    const handleSave = () => {
        if (!position || !skillLevel) {
            Alert.alert('Hata', 'Tüm alanları doldurun.');
            return;
        }

        // Burada API isteği yaparak bilgileri backend'e kaydedeceğiz
        Alert.alert('Başarılı', 'Futbol bilgileriniz kaydedildi.');
        navigation.replace('UserPanel');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Futbol Bilgilerini Tamamla</Text>
            <TextInput
                placeholder="Pozisyon (Forvet, Defans, vs.)"
                style={styles.input}
                value={position}
                onChangeText={setPosition}
            />
            <TextInput
                placeholder="Yetenek Seviyesi (1-100)"
                style={styles.input}
                value={skillLevel}
                onChangeText={setSkillLevel}
                keyboardType="numeric"
            />
            <Button title="Kaydet" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 22,
        marginBottom: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15
    }
});

export default CompletePlayerProfile;

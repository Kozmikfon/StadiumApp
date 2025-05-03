import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const dummyUser = {
    firstName: 'Ali',
    lastName: 'Yılmaz',
    email: 'ali@example.com',
    position: '',  // Pozisyon eksik!
    skillLevel: null
};

const UserPanel = ({ navigation }: any) => {

    useEffect(() => {
        if (!dummyUser.position || !dummyUser.skillLevel) {
            // Eğer pozisyon veya skill yoksa yönlendir
            navigation.replace('CompletePlayerProfile');
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hoşgeldin, {dummyUser.firstName}!</Text>
            <Text>Email: {dummyUser.email}</Text>
            <Text>Pozisyon: {dummyUser.position || 'Belirtilmemiş'}</Text>
            <Text>Yetenek Seviyesi: {dummyUser.skillLevel || 'Belirtilmemiş'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    }
});

export default UserPanel;

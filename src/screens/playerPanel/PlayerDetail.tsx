import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlayerDetail = ({ route }: any) => {
    const { player } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 Oyuncu Detayları</Text>
            <Text>Ad Soyad: {player.firstName} {player.lastName}</Text>
            <Text>Email: {player.email}</Text>
            <Text>Pozisyon: {player.position || 'Belirtilmemiş'}</Text>
            <Text>Skill Seviyesi: {player.skillLevel || 'Belirtilmemiş'}</Text>
            <Text>Rating: {player.rating || 'Belirtilmemiş'}</Text>
            <Text>Takım: {player.teamName || 'Takım yok'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15
    }
});

export default PlayerDetail;

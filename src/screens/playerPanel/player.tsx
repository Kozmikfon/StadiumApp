import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PlayerPanelScreen = ({ navigation }: any) => {

    function alert(arg0: string): void {
        throw new Error('Function not implemented.');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎮 Oyuncu Paneli</Text>

            <TouchableOpacity style={styles.button} onPress={() => alert('Profilim')}>
                <Text style={styles.buttonText}>Profilim</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => alert('Takımım')}>
                <Text style={styles.buttonText}>Takımım</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => alert('Maçlarım')}>
                <Text style={styles.buttonText}>Maçlarım</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => alert('Teklifler')}>
                <Text style={styles.buttonText}>Gelen Teklifler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => navigation.replace('Home')}>
                <Text style={styles.buttonText}>Çıkış Yap</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#2E7D32',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginVertical: 8
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default PlayerPanelScreen;

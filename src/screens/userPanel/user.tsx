import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const UserPanelScreen = ({ navigation }: any) => {

    function alert(arg0: string): void {
        throw new Error('Function not implemented.');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 Kullanıcı Paneli</Text>

            <TouchableOpacity style={styles.button} onPress={() => alert('Profilim')}>
                <Text style={styles.buttonText}>Profilim</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => alert('Takım Yönetimi')}>
                <Text style={styles.buttonText}>Takım Yönetimi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => alert('Oyuncularım')}>
                <Text style={styles.buttonText}>Oyuncularım</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => alert('Maç Yönetimi')}>
                <Text style={styles.buttonText}>Maç Yönetimi</Text>
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
        backgroundColor: '#3a7bd5',
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

export default UserPanelScreen;

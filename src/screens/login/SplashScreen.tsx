import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 2000); // 2 saniye sonra Home'a gider

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🏟️ StadyumApp</Text>
            <ActivityIndicator size="large" color="#4CAF50" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a2a6c'
    },
    title: {
        fontSize: 28,
        color: 'white',
        marginBottom: 20,
        fontWeight: 'bold'
    }
});

export default SplashScreen;

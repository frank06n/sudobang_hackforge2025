// app/index.tsx
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { Redirect, router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function WelcomeScreen() {
    const { isLoaded, isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Redirect href={'/dashboard'} />
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.appName}>ResQNet</Text>
                <Text style={styles.tagline}>Ambulance app</Text>
            </View>

            {isLoaded ?
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        onPress={() => router.push('/login')}
                    >
                        Login
                    </Button>

                    <Button
                        mode="outlined"
                        style={[styles.button, styles.registerButton]}
                        contentStyle={styles.buttonContent}
                        onPress={() => router.push('/register')}
                    >
                        Register
                    </Button>
                </View> :
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E53935" />
                </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    logo: {
        width: 120,
        height: 120,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 16,
        color: '#0066cc',
    },
    tagline: {
        fontSize: 16,
        color: '#555555',
        textAlign: 'center',
        marginTop: 8,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 40,
    },
    button: {
        marginVertical: 8,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    registerButton: {
        borderColor: '#0066cc',
    },
});
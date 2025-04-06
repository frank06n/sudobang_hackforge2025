// app/automatic-detection.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AutomaticDetectionScreen() {
    const [countdown, setCountdown] = useState(30);
    const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        // Pulse animation for the warning icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Simulate countdown
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Auto-activate SOS when countdown reaches zero
                    router.replace('/sos-active');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Simulate accelerometer data
        // In a real app, you would use Expo's accelerometer or device motion APIs
        const accelerometerTimer = setInterval(() => {
            setAccelerometerData({
                x: Math.random() * 8 - 4, // Random values between -4 and 4
                y: Math.random() * 8 - 4,
                z: Math.random() * 8 - 4 + 9.8, // Adding gravity component
            });
        }, 500);

        return () => {
            clearInterval(timer);
            clearInterval(accelerometerTimer);
        };
    }, []);

    const handleOkPress = () => {
        router.replace('/dashboard');
    };

    return (
        <View style={styles.container}>
            <Surface style={styles.warningCard}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Ionicons name="warning" size={80} color="#e74c3c" style={styles.warningIcon} />
                </Animated.View>

                <Text style={styles.warningTitle}>ARE YOU OKAY?</Text>

                <Text style={styles.warningDescription}>
                    A potential fall or accident has been detected.
                    If you're okay, please tap the button below.
                </Text>

                <Text style={styles.countdownText}>
                    Emergency services will be contacted in <Text style={styles.countdownValue}>{countdown}</Text> seconds
                    if no response is detected.
                </Text>

                <Button
                    mode="contained"
                    onPress={handleOkPress}
                    style={styles.okButton}
                    labelStyle={styles.okButtonLabel}
                >
                    I'M OKAY
                </Button>
            </Surface>

            <Surface style={styles.accelerometerCard}>
                <Text style={styles.accelerometerTitle}>Accelerometer Data (Debug)</Text>

                <View style={styles.accelerometerValues}>
                    <View style={styles.accelerometerValueRow}>
                        <Text style={styles.axisLabel}>X-axis:</Text>
                        <Text style={[
                            styles.axisValue,
                            Math.abs(accelerometerData.x) > 3 && styles.highValue
                        ]}>
                            {accelerometerData.x.toFixed(2)} m/s²
                        </Text>
                    </View>

                    <View style={styles.accelerometerValueRow}>
                        <Text style={styles.axisLabel}>Y-axis:</Text>
                        <Text style={[
                            styles.axisValue,
                            Math.abs(accelerometerData.y) > 3 && styles.highValue
                        ]}>
                            {accelerometerData.y.toFixed(2)} m/s²
                        </Text>
                    </View>

                    <View style={styles.accelerometerValueRow}>
                        <Text style={styles.axisLabel}>Z-axis:</Text>
                        <Text style={[
                            styles.axisValue,
                            Math.abs(accelerometerData.z - 9.8) > 3 && styles.highValue
                        ]}>
                            {accelerometerData.z.toFixed(2)} m/s²
                        </Text>
                    </View>
                </View>

                <View style={styles.accelerometerIndicator}>
                    <Text style={styles.indicatorLabel}>Fall Detection:</Text>
                    <View style={[
                        styles.indicatorDot,
                        styles.indicatorActive
                    ]} />
                </View>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
        justifyContent: 'center',
    },
    warningCard: {
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 4,
    },
    warningIcon: {
        marginBottom: 16,
    },
    warningTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 16,
        textAlign: 'center',
    },
    warningDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    countdownText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    countdownValue: {
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    okButton: {
        paddingHorizontal: 32,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: '#2ecc71',
    },
    okButtonLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    accelerometerCard: {
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        elevation: 4,
    },
    accelerometerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    accelerometerValues: {
        marginBottom: 16,
    },
    accelerometerValueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    axisLabel: {
        fontSize: 14,
        color: '#666666',
    },
    axisValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    highValue: {
        color: '#e74c3c',
    },
    accelerometerIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
    },
    indicatorLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    indicatorDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    indicatorActive: {
        backgroundColor: '#e74c3c',
    },
});
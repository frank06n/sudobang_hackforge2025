// app/verify-phone.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';

export default function VerifyPhoneScreen() {
    const { number } = useLocalSearchParams<{ number?: string }>();
    const router = useRouter();
    const { getToken } = useAuth();

    const [phoneNumber, setPhoneNumber] = useState<string>(number ?? '');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const validatePhoneNumber = (phone: string) => {
        // Basic validation - can be enhanced
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return phoneRegex.test(phone);
    };

    const verifyPhone = useCallback(async () => {
        try {
            const token = await getToken();

            // console.log('test json request', JSON.stringify({ number:phoneNumber }))
    
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/user/verify-phone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ number:phoneNumber }),
            });
            // console.log('response', response);
    
            const data = await response.json();
            // console.log('response', response);
    
            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
    
            console.log('OTP sent successfully', data);
        } catch (error) {
            console.error('Error verifying phone:', error);
        }
    }, [getToken]);

    const checkOtp = useCallback(async (otp:string) => {
        try {
            const token = await getToken();
    
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/user/verify-phone/check-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ otp }),
            });
            console.log('response', response);
    
            const data = await response.json();
            console.log('data', data);
    
            if (!response.ok) {
                console.log(data.error, data.details, 'OTP verification failed');
                return {verified: false, error: JSON.stringify(data, null, 2)};
            }
    
            console.log('Phone verified successfully');
            return {verified: true};
        } catch (error) {
            console.error('Error checking OTP:', error);
            return {verified: false, error: JSON.stringify(error, null, 2)};
        }
    }, [getToken]);

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (isVerifying && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, isVerifying]);

    const sendVerificationCode = async () => {
        setIsVerifying(true);
        setCanResend(false);
        setCountdown(60);

        try {
            if (!validatePhoneNumber(phoneNumber)) {
                setError('Please enter a valid phone number');
                setIsVerifying(false);
                return;
            }

            // Send verification code to the phone
            verifyPhone();
            Alert.alert('Verification code sent', `We've sent a code to ${phoneNumber}`);
        } catch (err) {
            console.error('Error sending verification code:', err);
            setError('Failed to send verification code. Please try again.');
            setIsVerifying(false);
        }
    };

    const handleVerifyPhone = async () => {
        if (!otp.trim()) {
            setError('Please enter the verification code');
            return;
        }

        // Attempt to verify the phone
        checkOtp(otp);
        const { verified, error } = await checkOtp(otp);
        if (verified) {
            Alert.alert('Success', 'Phone number verified successfully!', [
                { text: 'OK', onPress: () => router.replace('/') }
            ]);
        } else {
            setError(error || 'Failed to verify phone. Please try again.');
        }
    };

    const handleResendCode = () => {
        if (canResend) {
            sendVerificationCode();
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#0066cc" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Verify Phone</Text>
                <Text style={styles.subHeaderText}>We need to verify your phone number</Text>
            </View>

            <View style={styles.formContainer}>
                {!isVerifying && (
                    <>
                        <TextInput
                            label="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            mode="outlined"
                            keyboardType="phone-pad"
                            error={!!error && !otp}
                            style={styles.input}
                            left={<TextInput.Icon icon="phone" />}
                            placeholder="e.g. +1234567890"
                        />
                        <HelperText type="info">
                            Please include your country code (e.g. +1 for US)
                        </HelperText>
                        <Button
                            mode="contained"
                            style={styles.actionButton}
                            onPress={sendVerificationCode}
                        >
                            Send Verification Code
                        </Button>
                    </>
                )}

                {isVerifying && (
                    <>
                        <Text style={styles.phoneDisplay}>
                            {phoneNumber}
                        </Text>

                        <TextInput
                            label="Verification Code"
                            value={otp}
                            onChangeText={setOtp}
                            mode="outlined"
                            keyboardType="number-pad"
                            error={!!error && !!otp}
                            style={styles.input}
                            left={<TextInput.Icon icon="lock-check" />}
                            maxLength={6}
                        />

                        {!!error && <HelperText type="error">{error}</HelperText>}

                        <Button
                            mode="contained"
                            style={styles.actionButton}
                            onPress={handleVerifyPhone}
                        >
                            Verify
                        </Button>

                        <TouchableOpacity
                            style={styles.resendContainer}
                            onPress={handleResendCode}
                            disabled={!canResend}
                        >
                            <Text style={canResend ? styles.resendText : styles.resendTextDisabled}>
                                {canResend ? 'Resend Code' : `Resend Code (${countdown}s)`}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    backButton: {
        marginTop: 20,
    },
    headerContainer: {
        marginTop: 40,
        marginBottom: 40,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0066cc',
    },
    subHeaderText: {
        fontSize: 16,
        color: '#666666',
        marginTop: 8,
    },
    formContainer: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
    },
    actionButton: {
        marginTop: 16,
        borderRadius: 8,
        paddingVertical: 8,
    },
    resendContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    resendText: {
        color: '#0066cc',
        fontSize: 16,
    },
    resendTextDisabled: {
        color: '#b0b0b0',
        fontSize: 16,
    },
    phoneDisplay: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    }
});
// app/register.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Button, Text, TextInput, HelperText, Checkbox } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';

interface FormErrors {
    driverName: string;
    email: string;
    ambulanceId: string;
    contactNumber: string;
    password: string;
    confirmPassword: string;
    terms: string;
}

export default function RegisterScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [driverName, setDriverName] = useState('');
    const [email, setEmail] = useState('');
    const [ambulanceId, setAmbulanceId] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string, size: number }>>([]);
    const [errors, setErrors] = useState<FormErrors>({
        driverName: '',
        email: '',
        ambulanceId: '',
        contactNumber: '',
        password: '',
        confirmPassword: '',
        terms: '',
    });

    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
                multiple: true,
            });

            if (result.canceled === false) {
                setSelectedFiles(result.assets.map(file => ({
                    name: file.name,
                    size: file.size ?? 0,
                })));
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            driverName: '',
            email: '',
            ambulanceId: '',
            contactNumber: '',
            password: '',
            confirmPassword: '',
            terms: '',
        };

        let isValid = true;

        // Validate driver name
        if (!driverName.trim()) {
            newErrors.driverName = 'Driver\'s name is required';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        // Validate ambulance ID
        if (!ambulanceId.trim()) {
            newErrors.ambulanceId = 'Ambulance Number/ID is required';
            isValid = false;
        }

        // Validate contact number
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!contactNumber.trim()) {
            newErrors.contactNumber = 'Contact Number is required';
            isValid = false;
        } else if (!phoneRegex.test(contactNumber)) {
            newErrors.contactNumber = 'Please enter a valid contact number';
            isValid = false;
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
        if (!password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, and number';
            isValid = false;
        }

        // Validate confirm password
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        // Validate terms acceptance
        if (!termsAccepted) {
            newErrors.terms = 'You must accept the terms and conditions';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        if (!isLoaded) return

        try {
            await signUp.create({
                firstName: driverName.split(' ')[0],
                lastName: driverName.split(' ').slice(1).join(' '),
                emailAddress: email,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            setPendingVerification(true)
        } catch (err) {
            if (isClerkAPIResponseError(err)) {
                Alert.alert('Error', err.errors[0].longMessage);
                console.log(JSON.stringify(err, null, 2));
                console.log(email);
            }
            else {
                console.error(JSON.stringify(err, null, 2));
            }
            // You might want to set a general error message here
        }
    };

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace('/')
            } else {
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    // Verification code screen
    if (pendingVerification) {
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text variant="headlineMedium" style={styles.verifyBoxTitle}>
                        Verify Your Email
                    </Text>
                    <Text style={styles.verifyBoxSubtitle}>
                        Enter the 6-digit code sent to {email}
                    </Text>

                    <TextInput
                        label="Verification Code"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="numeric"
                        style={styles.input}
                        maxLength={6}
                    />

                    <Button
                        mode="contained"
                        onPress={onVerifyPress}
                        style={styles.verifyButton}
                    >
                        Verify
                    </Button>

                    <Button
                        mode="text"
                        onPress={() => setPendingVerification(false)}
                    >
                        Go Back
                    </Button>
                </View>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#0066cc" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Driver Registration</Text>
                <Text style={styles.subHeaderText}>Sign up to get started</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    label="Driver's Name"
                    value={driverName}
                    onChangeText={setDriverName}
                    mode="outlined"
                    error={!!errors.driverName}
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                />
                {!!errors.driverName && <HelperText type="error">{errors.driverName}</HelperText>}

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={!!errors.email}
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                />
                {!!errors.email && <HelperText type="error">{errors.email}</HelperText>}

                <TextInput
                    label="Ambulance Number/ID"
                    value={ambulanceId}
                    onChangeText={setAmbulanceId}
                    mode="outlined"
                    error={!!errors.ambulanceId}
                    style={styles.input}
                    left={<TextInput.Icon icon="ambulance" />}
                />
                {!!errors.ambulanceId && <HelperText type="error">{errors.ambulanceId}</HelperText>}

                <TextInput
                    label="Contact Number"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    mode="outlined"
                    keyboardType="phone-pad"
                    error={!!errors.contactNumber}
                    style={styles.input}
                    left={<TextInput.Icon icon="phone" />}
                />
                {!!errors.contactNumber && <HelperText type="error">{errors.contactNumber}</HelperText>}

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry={secureTextEntry}
                    error={!!errors.password}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                        <TextInput.Icon
                            icon={secureTextEntry ? "eye" : "eye-off"}
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        />
                    }
                />
                {!!errors.password && <HelperText type="error">{errors.password}</HelperText>}

                <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    mode="outlined"
                    secureTextEntry={secureConfirmTextEntry}
                    error={!!errors.confirmPassword}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                        <TextInput.Icon
                            icon={secureConfirmTextEntry ? "eye" : "eye-off"}
                            onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                        />
                    }
                />
                {!!errors.confirmPassword && <HelperText type="error">{errors.confirmPassword}</HelperText>}

                <View style={styles.documentUploadContainer}>
                    <Text style={styles.documentTitle}>Upload Credentials/Certification Documents</Text>
                    <Button
                        mode="outlined"
                        style={styles.uploadButton}
                        onPress={pickDocument}
                        icon="file-upload"
                    >
                        Choose Files
                    </Button>

                    {selectedFiles.length > 0 && (
                        <View style={styles.fileListContainer}>
                            <Text style={styles.selectedFilesTitle}>Selected Files:</Text>
                            {selectedFiles.map((file, index) => (
                                <View key={index} style={styles.fileItem}>
                                    <Ionicons name="document" size={16} color="#0066cc" />
                                    <Text style={styles.fileName}>{file.name}</Text>
                                    <Text style={styles.fileSize}>
                                        {(file.size / 1024).toFixed(2)} KB
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.termsContainer}>
                    <Checkbox
                        status={termsAccepted ? 'checked' : 'unchecked'}
                        onPress={() => setTermsAccepted(!termsAccepted)}
                    />
                    <View style={styles.termsTextContainer}>
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text
                                style={styles.termsLink}
                                onPress={() => router.push('/terms')}
                            >
                                Terms & Conditions
                            </Text>
                            {' '}and{' '}
                            <Text
                                style={styles.termsLink}
                                onPress={() => router.push('/privacy')}
                            >
                                Privacy Policy
                            </Text>
                        </Text>
                    </View>
                </View>

                {!!errors.terms && <HelperText type="error">{errors.terms}</HelperText>}

                <Button
                    mode="contained"
                    style={styles.registerButton}
                    contentStyle={styles.buttonContent}
                    onPress={handleRegister}
                >
                    Register
                </Button>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
        marginTop: 20,
        marginBottom: 20,
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
        marginBottom: 8,
    },

    verifyBoxTitle: {
        textAlign: 'center',
        marginBottom: 16,
    },
    verifyBoxSubtitle: {
        textAlign: 'center',
        marginBottom: 16,
        color: 'gray',
    },
    verifyButton: {
        marginTop: 16,
        marginBottom: 8,
    },
    documentUploadContainer: {
        marginTop: 16,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    documentTitle: {
        fontSize: 16,
        marginBottom: 12,
        color: '#333333',
    },
    uploadButton: {
        borderColor: '#0066cc',
    },
    fileListContainer: {
        marginTop: 16,
    },
    selectedFilesTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: '#e6f2ff',
        borderRadius: 4,
    },
    fileName: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#333333',
    },
    fileSize: {
        fontSize: 12,
        color: '#666666',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        marginTop: 8,
    },
    termsTextContainer: {
        flex: 1,
        marginLeft: 8,
    },
    termsText: {
        fontSize: 14,
        color: '#666666',
    },
    termsLink: {
        color: '#0066cc',
        fontWeight: 'bold',
    },
    registerButton: {
        marginTop: 16,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
    loginText: {
        color: '#666666',
    },
    loginLink: {
        color: '#0066cc',
        fontWeight: 'bold',
    },
});
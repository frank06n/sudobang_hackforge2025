// app/settings.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert} from 'react-native';
import { Text, List, Divider, Button, RadioButton, Dialog, Portal, IconButton, Appbar, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking'

type ThemeOption = 'light' | 'dark' | 'system';
type LanguageOption = 'english' | 'spanish' | 'french' | 'german' | 'chinese';

export default function SettingsScreen() {
    const [notificationEnabled, setNotificationEnabled] = useState(true);
    const [emergencyAlertSoundEnabled, setEmergencyAlertSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);
    const [nfcEnabled, setNfcEnabled] = useState(false);
    const [biometricLoginEnabled, setBiometricLoginEnabled] = useState(true);
    const [autoSosEnabled, setAutoSosEnabled] = useState(true);

    const [theme, setTheme] = useState<ThemeOption>('system');
    const [language, setLanguage] = useState<LanguageOption>('english');

    const [themeDialogVisible, setThemeDialogVisible] = useState(false);
    const [languageDialogVisible, setLanguageDialogVisible] = useState(false);
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

    const { signOut } = useClerk();

    const handleLogout = async () => {
        try {
            // Here you would clear auth tokens, etc.
            await AsyncStorage.clear();
            setLogoutDialogVisible(false);

            // Navigate to login screen
            // router.replace('/welcome');
            await signOut()
            // Redirect to your desired page
            Linking.openURL(Linking.createURL('/'))
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
        }
    };

    const getThemeLabel = (theme: ThemeOption): string => {
        switch (theme) {
            case 'light': return 'Light';
            case 'dark': return 'Dark';
            case 'system': return 'System Default';
        }
    };

    const getLanguageLabel = (language: LanguageOption): string => {
        switch (language) {
            case 'english': return 'English';
            case 'spanish': return 'Spanish (Español)';
            case 'french': return 'French (Français)';
            case 'german': return 'German (Deutsch)';
            case 'chinese': return 'Chinese (中文)';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Settings" />
            </Appbar.Header>

            <ScrollView>
                <List.Section>
                    <List.Subheader>Notifications</List.Subheader>
                    <List.Item
                        title="Enable Notifications"
                        description="Receive important alerts and updates"
                        left={props => <List.Icon {...props} icon="bell" />}
                        right={props => (
                            <Switch
                                value={notificationEnabled}
                                onValueChange={setNotificationEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Emergency Alert Sound"
                        description="Play sound alerts for emergencies"
                        left={props => <List.Icon {...props} icon="volume-high" />}
                        right={props => (
                            <Switch
                                value={emergencyAlertSoundEnabled}
                                onValueChange={setEmergencyAlertSoundEnabled}
                                color="#E53935"
                                disabled={!notificationEnabled}
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Vibration"
                        description="Vibrate on notifications and alerts"
                        left={props => <List.Icon {...props} icon="vibrate" />}
                        right={props => (
                            <Switch
                                value={vibrationEnabled}
                                onValueChange={setVibrationEnabled}
                                color="#E53935"
                                disabled={!notificationEnabled}
                            />
                        )}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Privacy & Location</List.Subheader>
                    <List.Item
                        title="Location Tracking"
                        description="Allow ambulance services to track your location"
                        left={props => <List.Icon {...props} icon="map-marker" />}
                        right={props => (
                            <Switch
                                value={locationTrackingEnabled}
                                onValueChange={setLocationTrackingEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="NFC Medical ID"
                        description="Enable NFC tag for quick medical info access"
                        left={props => <List.Icon {...props} icon="nfc" />}
                        right={props => (
                            <Switch
                                value={nfcEnabled}
                                onValueChange={setNfcEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Biometric Login"
                        description="Use fingerprint or face ID to log in"
                        left={props => <List.Icon {...props} icon="fingerprint" />}
                        right={props => (
                            <Switch
                                value={biometricLoginEnabled}
                                onValueChange={setBiometricLoginEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Emergency Settings</List.Subheader>
                    <List.Item
                        title="Automatic SOS Detection"
                        description="Detect severe falls or accidents automatically"
                        left={props => <List.Icon {...props} icon="car-emergency" />}
                        right={props => (
                            <Switch
                                value={autoSosEnabled}
                                onValueChange={setAutoSosEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    {autoSosEnabled && (
                        <>
                            <Divider />
                            <List.Item
                                title="Sensitivity Level"
                                description="Adjust accident detection sensitivity"
                                left={props => <List.Icon {...props} icon="tune" />}
                                right={() => (
                                    <View style={styles.sensitivityContainer}>
                                        <Text style={styles.sensitivityLevel}>Medium</Text>
                                        <IconButton icon="chevron-right" size={24} />
                                    </View>
                                )}
                                onPress={() => Alert.alert('Sensitivity', 'This would open sensitivity adjustment slider')}
                            />
                        </>
                    )}
                </List.Section>

                <List.Section>
                    <List.Subheader>Appearance</List.Subheader>
                    <List.Item
                        title="Theme"
                        description={getThemeLabel(theme)}
                        left={props => <List.Icon {...props} icon="theme-light-dark" />}
                        onPress={() => setThemeDialogVisible(true)}
                    />
                    <Divider />
                    <List.Item
                        title="Language"
                        description={getLanguageLabel(language)}
                        left={props => <List.Icon {...props} icon="translate" />}
                        onPress={() => setLanguageDialogVisible(true)}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Account</List.Subheader>
                    <List.Item
                        title="Clear Cache"
                        description="Delete temporary files"
                        left={props => <List.Icon {...props} icon="cached" />}
                        onPress={() => Alert.alert('Cache Cleared', 'All temporary files have been deleted')}
                    />
                    <Divider />
                    <List.Item
                        title="Privacy Policy"
                        description="View our privacy policy"
                        left={props => <List.Icon {...props} icon="shield-account" />}
                        onPress={() => router.push('/privacy-policy')}
                    />
                    <Divider />
                    <List.Item
                        title="Terms of Service"
                        description="View our terms of service"
                        left={props => <List.Icon {...props} icon="file-document" />}
                        onPress={() => router.push('/terms')}
                    />
                    <Divider />
                    <List.Item
                        title="App Version"
                        description="v1.0.0 (Build 2025.04.02)"
                        left={props => <List.Icon {...props} icon="information" />}
                    />
                </List.Section>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        icon="logout"
                        style={styles.logoutButton}
                        onPress={() => setLogoutDialogVisible(true)}
                    >
                        Log Out
                    </Button>
                </View>
            </ScrollView>

            <Portal>
                <Dialog visible={themeDialogVisible} onDismiss={() => setThemeDialogVisible(false)}>
                    <Dialog.Title>Choose Theme</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={value => setTheme(value as ThemeOption)} value={theme}>
                            <RadioButton.Item label="Light" value="light" />
                            <RadioButton.Item label="Dark" value="dark" />
                            <RadioButton.Item label="System Default" value="system" />
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setThemeDialogVisible(false)}>Done</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={languageDialogVisible} onDismiss={() => setLanguageDialogVisible(false)}>
                    <Dialog.Title>Choose Language</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={value => setLanguage(value as LanguageOption)} value={language}>
                            <RadioButton.Item label="English" value="english" />
                            <RadioButton.Item label="Spanish (Español)" value="spanish" />
                            <RadioButton.Item label="French (Français)" value="french" />
                            <RadioButton.Item label="German (Deutsch)" value="german" />
                            <RadioButton.Item label="Chinese (中文)" value="chinese" />
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setLanguageDialogVisible(false)}>Done</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
                    <Dialog.Title>Confirm Logout</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to log out?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setLogoutDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleLogout}>Logout</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    sensitivityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sensitivityLevel: {
        marginRight: 5,
        color: '#555',
    },
    buttonContainer: {
        padding: 20,
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#E53935',
    },
});
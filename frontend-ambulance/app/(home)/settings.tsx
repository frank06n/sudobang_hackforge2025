// app/settings.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Divider, Button, RadioButton, Dialog, Portal, IconButton, Appbar, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useClerk } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

type ThemeOption = 'light' | 'dark' | 'system';
type NavigationVoiceOption = 'female' | 'male' | 'none';
type SirenOption = 'standard' | 'european' | 'american' | 'none';

export default function SettingsScreen() {
    // Notification Settings
    const [sosAlertsEnabled, setSosAlertsEnabled] = useState(true);
    const [priorityAlertsEnabled, setPriorityAlertsEnabled] = useState(true);
    const [hospitalUpdatesEnabled, setHospitalUpdatesEnabled] = useState(true);
    const [shiftReminderEnabled, setShiftReminderEnabled] = useState(true);
    
    // Navigation & Driving Settings
    const [navigationVoice, setNavigationVoice] = useState<NavigationVoiceOption>('female');
    const [autoRouteEnabled, setAutoRouteEnabled] = useState(true);
    const [trafficAlertsEnabled, setTrafficAlertsEnabled] = useState(true);
    const [hospitalRoutingEnabled, setHospitalRoutingEnabled] = useState(true);
    const [sirenType, setSirenType] = useState<SirenOption>('standard');
    
    // Security & Privacy
    const [locationSharingEnabled, setLocationSharingEnabled] = useState(true);
    const [biometricLoginEnabled, setBiometricLoginEnabled] = useState(true);
    const [dataEncryptionEnabled, setDataEncryptionEnabled] = useState(true);
    
    // Appearance
    const [theme, setTheme] = useState<ThemeOption>('system');
    
    // Dialogs
    const [themeDialogVisible, setThemeDialogVisible] = useState(false);
    const [navigationVoiceDialogVisible, setNavigationVoiceDialogVisible] = useState(false);
    const [sirenTypeDialogVisible, setSirenTypeDialogVisible] = useState(false);
    const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
    const [resetDialogVisible, setResetDialogVisible] = useState(false);
    
    const { signOut } = useClerk();

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            setLogoutDialogVisible(false);
            await signOut();
            Linking.openURL(Linking.createURL('/'));
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
        }
    };

    const handleReset = async () => {
        try {
            // Reset app settings but maintain login
            await AsyncStorage.multiRemove([
                'settings_navigation',
                'settings_notifications',
                'settings_appearance',
                'settings_security'
            ]);
            setResetDialogVisible(false);
            
            // Reset all state variables to defaults
            setSosAlertsEnabled(true);
            setPriorityAlertsEnabled(true);
            setHospitalUpdatesEnabled(true);
            setShiftReminderEnabled(true);
            setNavigationVoice('female');
            setAutoRouteEnabled(true);
            setTrafficAlertsEnabled(true);
            setHospitalRoutingEnabled(true);
            setSirenType('standard');
            setLocationSharingEnabled(true);
            setBiometricLoginEnabled(true);
            setDataEncryptionEnabled(true);
            setTheme('system');
            
            Alert.alert('Settings Reset', 'All settings have been reset to default values.');
        } catch (error) {
            console.error('Error resetting settings:', error);
            Alert.alert('Error', 'Failed to reset settings. Please try again.');
        }
    };

    const getThemeLabel = (theme: ThemeOption): string => {
        switch (theme) {
            case 'light': return 'Light';
            case 'dark': return 'Dark';
            case 'system': return 'System Default';
        }
    };

    const getNavigationVoiceLabel = (voice: NavigationVoiceOption): string => {
        switch (voice) {
            case 'female': return 'Female Voice';
            case 'male': return 'Male Voice';
            case 'none': return 'Voice Disabled';
        }
    };

    const getSirenTypeLabel = (siren: SirenOption): string => {
        switch (siren) {
            case 'standard': return 'Standard';
            case 'european': return 'European Style';
            case 'american': return 'American Style';
            case 'none': return 'Disabled (For Maintenance)';
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
                    <List.Subheader>Alert Notifications</List.Subheader>
                    <List.Item
                        title="SOS Alerts"
                        description="Receive emergency SOS requests from patients"
                        left={props => <List.Icon {...props} icon="ambulance" />}
                        right={props => (
                            <Switch
                                value={sosAlertsEnabled}
                                onValueChange={setSosAlertsEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Priority Hospital Dispatches"
                        description="Receive high-priority dispatch notifications"
                        left={props => <List.Icon {...props} icon="hospital" />}
                        right={props => (
                            <Switch
                                value={priorityAlertsEnabled}
                                onValueChange={setPriorityAlertsEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Hospital Status Updates"
                        description="Receive bed capacity and traffic updates"
                        left={props => <List.Icon {...props} icon="hospital-building" />}
                        right={props => (
                            <Switch
                                value={hospitalUpdatesEnabled}
                                onValueChange={setHospitalUpdatesEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Shift Reminders"
                        description="Get notifications about upcoming shifts"
                        left={props => <List.Icon {...props} icon="clock-time-four" />}
                        right={props => (
                            <Switch
                                value={shiftReminderEnabled}
                                onValueChange={setShiftReminderEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Navigation & Driving</List.Subheader>
                    <List.Item
                        title="Navigation Voice"
                        description={getNavigationVoiceLabel(navigationVoice)}
                        left={props => <List.Icon {...props} icon="account-voice" />}
                        onPress={() => setNavigationVoiceDialogVisible(true)}
                    />
                    <Divider />
                    <List.Item
                        title="Automatic Route Calculation"
                        description="Auto-calculate fastest route to patient"
                        left={props => <List.Icon {...props} icon="map-marker-path" />}
                        right={props => (
                            <Switch
                                value={autoRouteEnabled}
                                onValueChange={setAutoRouteEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Traffic Alerts"
                        description="Receive real-time traffic updates during navigation"
                        left={props => <List.Icon {...props} icon="traffic-light" />}
                        right={props => (
                            <Switch
                                value={trafficAlertsEnabled}
                                onValueChange={setTrafficAlertsEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Smart Hospital Routing"
                        description="Prioritize routes to hospitals with available capacity"
                        left={props => <List.Icon {...props} icon="hospital-marker" />}
                        right={props => (
                            <Switch
                                value={hospitalRoutingEnabled}
                                onValueChange={setHospitalRoutingEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                    <Divider />
                    <List.Item
                        title="Siren Type"
                        description={getSirenTypeLabel(sirenType)}
                        left={props => <List.Icon {...props} icon="bullhorn" />}
                        onPress={() => setSirenTypeDialogVisible(true)}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Security & Privacy</List.Subheader>
                    <List.Item
                        title="Location Sharing"
                        description="Share location with dispatch control center"
                        left={props => <List.Icon {...props} icon="map-marker" />}
                        right={props => (
                            <Switch
                                value={locationSharingEnabled}
                                onValueChange={setLocationSharingEnabled}
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
                    <Divider />
                    <List.Item
                        title="Data Encryption"
                        description="Enable end-to-end encryption for patient data"
                        left={props => <List.Icon {...props} icon="shield-lock" />}
                        right={props => (
                            <Switch
                                value={dataEncryptionEnabled}
                                onValueChange={setDataEncryptionEnabled}
                                color="#E53935"
                            />
                        )}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Appearance</List.Subheader>
                    <List.Item
                        title="Theme"
                        description={getThemeLabel(theme)}
                        left={props => <List.Icon {...props} icon="theme-light-dark" />}
                        onPress={() => setThemeDialogVisible(true)}
                    />
                </List.Section>

                <List.Section>
                    <List.Subheader>Account & Vehicle</List.Subheader>
                    <List.Item
                        title="Update Credentials"
                        description="Update your paramedic/driver credentials"
                        left={props => <List.Icon {...props} icon="card-account-details" />}
                        onPress={() => router.push('/update-credentials')}
                    />
                    <Divider />
                    <List.Item
                        title="Vehicle Maintenance Log"
                        description="Record and view ambulance maintenance history"
                        left={props => <List.Icon {...props} icon="car-wrench" />}
                        onPress={() => router.push('/maintenance-log')}
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
                        description="v1.0.0 (Build 2025.04.06)"
                        left={props => <List.Icon {...props} icon="information" />}
                    />
                </List.Section>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        icon="restore"
                        style={styles.resetButton}
                        onPress={() => setResetDialogVisible(true)}
                    >
                        Reset to Defaults
                    </Button>
                    <View style={styles.buttonSpacer} />
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

                <Dialog visible={navigationVoiceDialogVisible} onDismiss={() => setNavigationVoiceDialogVisible(false)}>
                    <Dialog.Title>Navigation Voice</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={value => setNavigationVoice(value as NavigationVoiceOption)} value={navigationVoice}>
                            <RadioButton.Item label="Female Voice" value="female" />
                            <RadioButton.Item label="Male Voice" value="male" />
                            <RadioButton.Item label="Voice Disabled" value="none" />
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setNavigationVoiceDialogVisible(false)}>Done</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={sirenTypeDialogVisible} onDismiss={() => setSirenTypeDialogVisible(false)}>
                    <Dialog.Title>Siren Type</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={value => setSirenType(value as SirenOption)} value={sirenType}>
                            <RadioButton.Item label="Standard" value="standard" />
                            <RadioButton.Item label="European Style" value="european" />
                            <RadioButton.Item label="American Style" value="american" />
                            <RadioButton.Item label="Disabled (For Maintenance)" value="none" />
                        </RadioButton.Group>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setSirenTypeDialogVisible(false)}>Done</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={resetDialogVisible} onDismiss={() => setResetDialogVisible(false)}>
                    <Dialog.Title>Reset Settings</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to reset all settings to default values?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setResetDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleReset}>Reset</Button>
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
    buttonContainer: {
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
    },
    buttonSpacer: {
        width: 10,
    },
    resetButton: {
        flex: 1,
        borderColor: '#757575',
    },
    logoutButton: {
        flex: 1,
        backgroundColor: '#E53935',
    },
});
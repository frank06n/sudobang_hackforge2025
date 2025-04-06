// app/sos-active.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Surface, ActivityIndicator, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import axios from 'axios';

enum AmbSearchStatus {
    Searching = "searching",
    Found = "found",
}

export default function SOSActiveScreen() {
    const [status, setStatus] = useState(AmbSearchStatus.Searching);
    const [ambulanceInfo, setAmbulanceInfo] = useState<{ id: string, driver: string } | null>(null);

    const [userLocation, setUserLocation] = useState<null | { latitude: number; longitude: number }>(null);
    const [ambulanceLocation, setAmbulanceLocation] = useState({
        latitude: 22.662271,
        longitude: 88.433432,
    });
    const [eta, setEta] = useState('');
    const [paramedic, setParamedic] = useState<null | { name: string; id: string; phone: string }>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
    
    const region = useMemo(() => {
        return {
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            latitude: userLocation ? userLocation.latitude : 22.6689024,
            longitude: userLocation ? userLocation.longitude : 88.4277248,
        };
    }, [userLocation]);

    useEffect(() => {
        // Simulate the process of finding and dispatching an ambulance
        const searchTimer = setTimeout(() => {
            setStatus(AmbSearchStatus.Found);
            setAmbulanceInfo({
                id: 'AMB-2023-42',
                driver: 'David Wilson'
            });
            setParamedic({
                name: 'Susie Rodriguez',
                id: 'AMB-2023-42',
                phone: '+14155552671',
            });
            setEta('8 minutes');
        }, 3000);

        return () => clearTimeout(searchTimer);
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            console.log("fetching route:");
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${ambulanceLocation.longitude},${ambulanceLocation.latitude};${location.coords.longitude},${location.coords.latitude}?geometries=geojson`;
                const response = await axios.get(url);
                
                if (response.data && response.data.routes.length > 0) {
                    const coordinates = response.data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
                        latitude: coord[1],
                        longitude: coord[0],
                    }));
                    // console.log(response.data);
                    setRouteCoordinates(coordinates);
                }
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        })();
    }, [userLocation?.latitude, userLocation?.longitude]);

    return (
        <View style={styles.container}>
            <Surface style={styles.statusCard}>
                <View style={styles.statusHeader}>
                    <Ionicons name="medical" size={28} color="#e74c3c" />
                    <Text style={styles.statusTitle}>
                        Emergency Alert Active
                    </Text>
                </View>

                {status === AmbSearchStatus.Searching ? (
                    <View style={styles.searchingContainer}>
                        <ActivityIndicator size="large" color="#e74c3c" />
                        <Text style={styles.searchingText}>
                            Searching for nearest available ambulance...
                        </Text>
                        <Text style={styles.helpText}>
                            Help is on the way. Stay calm and try to remain in your current location.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.ambulanceInfoContainer}>
                        <View style={styles.ambulanceHeader}>
                            <Text style={styles.ambulanceFound}>Ambulance Dispatched!</Text>
                            <Surface style={styles.etaBadge}>
                                <Text style={styles.etaText}>ETA: {eta}</Text>
                            </Surface>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.ambulanceDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Ambulance ID:</Text>
                                <Text style={styles.detailValue}>{ambulanceInfo?.id}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Driver:</Text>
                                <Text style={styles.detailValue}>{ambulanceInfo?.driver}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Paramedic:</Text>
                                <Text style={styles.detailValue}>{paramedic?.name}</Text>
                            </View>
                        </View>

                        <Button
                            mode="contained"
                            icon="phone"
                            onPress={() => router.push('/in-app-messaging')}
                            style={styles.contactButton}
                        >
                            Contact Paramedic
                        </Button>
                    </View>
                )}
            </Surface>

            <View style={styles.mapContainer}>
                <Text style={styles.mapTitle}>Live Tracking</Text>

                {!userLocation && <Text style={styles.helpText}>Fetching your location...</Text>}
                {userLocation && routeCoordinates.length === 0 && <Text style={styles.helpText}>Fetching route...</Text>}

                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                >
                    {userLocation && (
                        <Marker
                            coordinate={userLocation}
                            title="Your Location"
                            description="You are here"
                            pinColor="blue"
                        />
                    )}
                    <Marker
                        coordinate={ambulanceLocation}
                        title="Ambulance"
                        description={`ETA: ${eta}`}
                    >
                        <FontAwesome name="ambulance" size={30} color="#E53935" />
                    </Marker>
                    
                    {routeCoordinates.length > 0 && (
                        <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="red" />
                    )}
                </MapView>
            </View>

            <View style={styles.bottomButtonContainer}>
                <Button
                    mode="outlined"
                    icon="close-circle"
                    onPress={() => router.replace('/dashboard')}
                    style={styles.cancelEmergencyButton}
                    buttonColor="#ffffff"
                    textColor="#e74c3c"
                >
                    Cancel Emergency
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
        paddingTop: 16 + Constants.statusBarHeight,
    },
    statusCard: {
        padding: 16,
        borderRadius: 12,
        elevation: 4,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginLeft: 8,
    },
    searchingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    searchingText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    helpText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666666',
        marginTop: 16,
    },
    ambulanceInfoContainer: {
        paddingVertical: 10,
    },
    ambulanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ambulanceFound: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2ecc71',
    },
    etaBadge: {
        backgroundColor: '#f0f8ff',
        padding: 8,
        borderRadius: 20,
        elevation: 1,
    },
    etaText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0066cc',
    },
    divider: {
        marginVertical: 12,
    },
    ambulanceDetails: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    contactButton: {
        marginVertical: 8,
    },
    mapContainer: {
        flex: 1,
        marginTop: 20,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        padding: 12,
    },
    mapTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    map: {
        flex: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    ambulanceMarker: {
        backgroundColor: '#0066cc',
        padding: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    bottomButtonContainer: {
        marginTop: 16,
        marginBottom: 30,
    },
    cancelEmergencyButton: {
        borderColor: '#e74c3c',
        borderWidth: 2,
    },
});
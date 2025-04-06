import { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Redirect, usePathname } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { ActivityIndicator, Text } from 'react-native-paper';

type UserProfile = {
  number?: string;
  numberVerified?: boolean;
};

export default function Layout() {
    const { isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const pathname = usePathname();

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const postCreateUser = async () => {
            try {
                const token = await getToken();

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/user/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ number: '', documents: [] })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
                }
    
                const data = await response.json();
                
                return data;
            } catch (error) {
                console.error('Error creating user:', error);
            }
        };

        const fetchUserProfile = async () => {
            try {
                const token = await getToken();

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.status === 404 || !data.user) {
                    console.log('User not found, attempting to create...');
                    await postCreateUser();
                    setUserProfile({
                        number: '',
                        numberVerified: false,
                    });
                    return;
                }
    
                if (response.ok && data.user) {
                    setUserProfile({
                        number: data.user.number,
                        numberVerified: data.user.numberVerified,
                    });
                } else {
                    throw new Error(data.error || 'Failed to fetch user profile');
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoadingProfile(false);
            }
        };

        if (isLoaded && isSignedIn) {
            fetchUserProfile();
        }
    }, [isLoaded, isSignedIn]);

    // Redirect unauthenticated users
    if (isLoaded && !isSignedIn && pathname !== '/') {
        return <Redirect href="/" />;
    }

    // Wait for user profile if signed in
    if (isSignedIn && loadingProfile) {
        return <>
            <ActivityIndicator
                animating={true}
                size="large"
                color="#0000ff"
                style={{ marginTop: 20 }}
            />
            <Text>Loading profile...</Text>
        </>;
    }

    // If user is signed in but not verified, redirect
    if (isSignedIn && userProfile && !userProfile.numberVerified) {
        const numberParam = userProfile.number ? `?number=${encodeURIComponent(userProfile.number)}` : '';
        return <Redirect href={`/verify-phone${numberParam}`} />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}

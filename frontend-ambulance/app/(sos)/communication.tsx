// app/in-app-messaging.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, TextInput, Avatar, Surface, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'paramedic';
    timestamp: Date;
    image?: string;
}

const getAutomaticResponse = (text: string): string => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('pain') || lowerText.includes('hurt'))
    {
        return "I understand you're in pain. Can you rate it from 1-10 and tell me exactly where it hurts? This will help us prepare.";
    } else if (lowerText.includes('time') || lowerText.includes('eta') || lowerText.includes('arrive')) 
    {
        return "We're about 5 minutes away from your location. Please stay calm and we'll be there as soon as possible.";
    } else if (lowerText.includes('thank')) 
    {
        return "You're welcome. We're here to help. Is there anything specific you need us to bring from the ambulance when we arrive?";
    } else if (lowerText.includes('breath')) 
    {
        return 'If you\'re having trouble breathing, try to sit upright and take slow, deep breaths if possible. We\'re on our way.';
    } else 
    {
        return "I've noted your message. We're on our way and will be there shortly. Is there anything specific about your condition I should know?";
    }
};

export default function InAppMessagingScreen() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hello, I\'m Paramedic Susie. I\'ve been dispatched to your location. Our estimated arrival time is 8 minutes. How can I help you?',
            sender: 'paramedic',
            timestamp: new Date(Date.now() - 60000),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isAttaching, setIsAttaching] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // Automatically scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                content: inputText.trim(),
                sender: 'user',
                timestamp: new Date(),
            };

            setMessages([...messages, newMessage]);
            setInputText('');

            // Simulate paramedic response after a delay
            setTimeout(() => {
                const responseMessage: Message = {
                    id: Date.now().toString(),
                    content: getAutomaticResponse(inputText),
                    sender: 'paramedic',
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, responseMessage]);
            }, 1500);
        }
    };

    const handleAttachImage = async () => {
        setIsAttaching(false);

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newMessage: Message = {
                id: Date.now().toString(),
                content: 'Photo attached',
                sender: 'user',
                timestamp: new Date(),
                image: result.assets[0].uri,
            };

            setMessages([...messages, newMessage]);

            // Simulate paramedic response after a delay
            setTimeout(() => {
                const responseMessage: Message = {
                    id: Date.now().toString(),
                    content: 'Thank you for sharing the image. This helps us prepare better for your situation. We\'ll be there shortly.',
          sender: 'paramedic',
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, responseMessage]);
            }, 2000);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => router.push('/sos_details')}
                />
                <View style={styles.paramedicInfo}>
                    <Avatar.Image
                        size={40}
                        source={require('../../assets/paramedic.png')}
                    />
                    <View style={styles.paramedicDetails}>
                        <Text style={styles.paramedicName}>Paramedic Susie</Text>
                        <View style={styles.statusContainer}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>En Route</Text>
                        </View>
                    </View>
                </View>
                <IconButton
                    icon="phone"
                    size={24}
                    onPress={() => Alert.alert('Call', 'Call functionality would be implemented here')}
                />
            </View>

            <ScrollView
                style={styles.messagesContainer}
                ref={scrollViewRef}
                contentContainerStyle={styles.messagesContent}
            >
                {messages.map((message) => (
                    <View
                        key={message.id}
                        style={[
                            styles.messageBubble,
                            message.sender === 'user' ? styles.userBubble : styles.paramedicBubble
                        ]}
                    >
                        {message.image && (
                            <View style={styles.imageContainer}>
                                <TouchableOpacity>
                                    <Image
                                        source={{ uri: message.image }}
                                        style={styles.messageImage}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        <Text style={[styles.messageText,
                            message.sender === 'user' ? styles.userMessageContent : styles.paramedicMessageContent ]}>{message.content}</Text>
                        <Text style={[styles.timestamp,
                            message.sender === 'user' ? styles.userMessageContent : styles.paramedicMessageContent]}>{formatTime(message.timestamp)}</Text>
                    </View>
                ))}
            </ScrollView>

            {isAttaching && (
                <Surface style={styles.attachmentOptions}>
                    <TouchableOpacity
                        style={styles.attachmentOption}
                        onPress={handleAttachImage}
                    >
                        <View style={[styles.attachmentIcon, styles.galleryIcon]}>
                            <Ionicons name="images" size={24} color="#ffffff" />
                        </View>
                        <Text style={styles.attachmentText}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.attachmentOption}
                        onPress={() => {
                            setIsAttaching(false);
                            // Handle document upload
                        }}
                    >
                        <View style={[styles.attachmentIcon, styles.documentIcon]}>
                            <Ionicons name="document" size={24} color="#ffffff" />
                        </View>
                        <Text style={styles.attachmentText}>Document</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.attachmentOption}
                        onPress={() => {
                            setIsAttaching(false);
                            // Handle camera action
                        }}
                    >
                        <View style={[styles.attachmentIcon, styles.cameraIcon]}>
                            <Ionicons name="camera" size={24} color="#ffffff" />
                        </View>
                        <Text style={styles.attachmentText}>Camera</Text>
                    </TouchableOpacity>
                </Surface>
            )}

            <View style={styles.inputContainer}>
                <IconButton
                    icon="paperclip"//attach
                    size={24}
                    onPress={() => setIsAttaching(!isAttaching)}
                    style={styles.attachButton}
                    iconColor={isAttaching ? "#0066cc" : "#666666"}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    contentStyle={{textAlignVertical: 'center'}}
                    outlineStyle={{borderRadius: 12}}
                    mode="outlined"
                    activeOutlineColor="#0066cc"
                />

                <IconButton
                    style={[
                        styles.sendButton,
                        !inputText.trim() && styles.sendButtonDisabled
                    ]}
                    icon="send"
                    iconColor='#ffffff'
                    size={24}
                    onPress={handleSend}
                    disabled={!inputText.trim()}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        paddingTop: 50,
    },
    paramedicInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    paramedicDetails: {
        marginLeft: 12,
    },
    paramedicName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2ecc71',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#666666',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
    },
    userBubble: {
        backgroundColor: '#0066cc',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    paramedicBubble: {
        backgroundColor: '#ffffff',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
    },
    userMessageContent: {
        color: '#ffffff'
    },
    paramedicMessageContent: {
        color: '#000000'
    },
    imageContainer: {
        marginBottom: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 12,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
        opacity: 0.7,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        justifyContent: 'space-between',
        gap: 10,
    },
    attachButton: {
        padding: 4,
        margin: 0,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        backgroundColor: '#ffffff',
        margin: 0,
    },
    sendButton: {
        backgroundColor: '#0066cc',
        margin: 0,
    },
    sendButtonDisabled: {
        backgroundColor: '#cccccc',
        margin: 0,
    },
    attachmentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        backgroundColor: '#ffffff',
    },
    attachmentOption: {
        alignItems: 'center',
    },
    attachmentIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    galleryIcon: {
        backgroundColor: '#4caf50',
    },
    documentIcon: {
        backgroundColor: '#ff9800',
    },
    cameraIcon: {
        backgroundColor: '#9c27b0',
    },
    attachmentText: {
        fontSize: 12,
    },
});
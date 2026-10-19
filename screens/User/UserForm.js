import Navbar from '../../src/components/Navbar';
import React from 'react';
import { Text, View } from 'react-native';

export default function UserForm() {
    return (
        <View style={{ flex: 1 }}>
            <Navbar />
            <View style={{ padding: 16 }}>
                <Text>Editame</Text>
            </View>
        </View>
    );
}


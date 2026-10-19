import Navbar from '../../src/components/Navbar';
import React from 'react';
import { Text, View, Button} from 'react-native';

export default function UserForm({navigation}) {
    return (
        <View style={{ flex: 1 }}>
            <Navbar />
            <View style={{padding: 16 }}>
            <Text>Edita el usuario</Text>
            <Button title="Editar" onPress={() => navigation.navigate('UserForm')} />
        </View>
    </View>
    );
}
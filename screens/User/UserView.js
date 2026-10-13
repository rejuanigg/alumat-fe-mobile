import React from 'react';
import { Text, View, Button} from 'react-native';

export default function UserForm({navigation}) {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>Edita el usuario</Text>
            <Button title="Editar" onPress={() => navigation.navigate('UserForm')} />
        </View>
    );
}
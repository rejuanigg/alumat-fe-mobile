import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserForm from '../screens/User/UserForm';
import UserView from '../screens/User/UserView';

const Stack = createStackNavigator();

export default function ProductsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="UserView" component={UserView} options={{ headerShown: false }} />
            <Stack.Screen name="UserForm" component={UserForm} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

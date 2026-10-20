
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navbarScreenOptions } from '../src/components/Navbar';
import UserForm from '../screens/User/UserForm';
import UserView from '../screens/User/UserView';

const Stack = createStackNavigator();

export default function UserStack() {
    return (
        <Stack.Navigator screenOptions={navbarScreenOptions}>
            <Stack.Screen name="UserView" component={UserView} />
            <Stack.Screen name="UserForm" component={UserForm} />
        </Stack.Navigator>
    );
}
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/EditProfile';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            // Solo cambiar initializing a false después de que Firebase Auth esté listo
            if (initializing) {
                // Agregar un pequeño delay para asegurar que todo esté listo
                setTimeout(() => setInitializing(false), 500);
            }
        });

        return unsubscribe;
    }, [initializing]);

    // Mostrar splash mientras Firebase Auth se inicializa
    if (initializing) {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen 
                        name="Splash" 
                        component={SplashScreen} 
                        options={{ headerShown: false }} 
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen 
                            name="Home" 
                            component={HomeScreen} 
                            options={{ 
                                title: 'Inicio',
                                headerShown: false 
                            }} 
                        />
                        <Stack.Screen 
                            name="EditProfile" 
                            component={EditProfileScreen} 
                            options={{ title: 'Editar Perfil' }} 
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen 
                            name="Login" 
                            component={LoginScreen} 
                            options={{ 
                                title: 'Login',
                                headerShown: false 
                            }} 
                        />
                        <Stack.Screen 
                            name="Register" 
                            component={RegisterScreen} 
                            options={{ 
                                title: 'Registro',
                                headerShown: false 
                            }} 
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
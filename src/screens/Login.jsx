// screens/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import useLogin from '../hooks/useLogin';

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    login
  } = useLogin();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={loading ? 'Cargando...' : 'Entrar'}
        onPress={login}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  error: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center'
  }
});


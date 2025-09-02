import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Button from "../components/Button";
import Input from "../components/Input";
import useRegister from "../hooks/useRegister";

export default function RegisterScreen({ navigation }) {
  const {
    nombre,
    setNombre,
    correo,
    setCorreo,
    password,
    setPassword,
    edad,
    setEdad,
    especialidad,
    setEspecialidad,
    loading,
    error,
    register,
  } = useRegister();

  const handleRegister = async () => {
    const success = await register();
    if (success) {
      Alert.alert(
        "¡Registro Exitoso!",
        "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
        [
          {
            text: "Ir al Login",
            onPress: () => navigation.navigate("Login"),
            style: "default"
          }
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>👤</Text>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Únete a nosotros</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Nombre completo"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre completo"
              icon="account"
            />
            <Input
              label="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="email"
            />
            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              icon="lock"
            />
            <Input
              label="Edad"
              value={edad}
              onChangeText={setEdad}
              placeholder="Tu edad"
              keyboardType="numeric"
              icon="calendar"
            />
            <Input
              label="Especialidad"
              value={especialidad}
              onChangeText={setEspecialidad}
              placeholder="Tu especialidad o profesión"
              icon="school"
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.error}>{error}</Text>
              </View>
            )}

            <Button
              icon="account-plus"
              onPress={handleRegister}
              disabled={loading}
              size="large"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    marginTop: 20,
    color: '#007bff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});
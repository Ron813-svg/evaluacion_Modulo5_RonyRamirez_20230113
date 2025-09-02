import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';
import Input from '../components/Input';
import useAuth from '../hooks/useAuth';
import useUserData from '../hooks/useUserData';
import useProfileEdit from '../hooks/useProfileEdit';

export default function EditProfileScreen({ navigation, route }) {
  const { user } = useAuth();
  const { userData, docId, loading: loadingUserData, refreshUserData } = useUserData();
  const { loading: saving, error: saveError, updateUserProfile, hasChanges, clearError } = useProfileEdit();
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Callback para actualizar la pantalla Home
  const onProfileUpdated = route?.params?.onProfileUpdated;

  useEffect(() => {
    if (userData) {
      // Llenar los campos con los datos actuales
      setNombre(userData.nombre || '');
      setEdad(userData.edad || '');
      setEspecialidad(userData.especialidad || '');
    }
  }, [userData]);

  // Limpiar errores cuando el usuario escribe
  useEffect(() => {
    if (saveError || Object.keys(formErrors).length > 0) {
      clearError();
      setFormErrors({});
    }
  }, [nombre, edad, especialidad]);

  const handleSave = async () => {
    const formData = {
      nombre: nombre.trim(),
      edad: edad.trim(),
      especialidad: especialidad.trim()
    };

    // Verificar si hay cambios
    if (!hasChanges(userData, formData)) {
      Alert.alert('Sin cambios', 'No se detectaron cambios en la información');
      return;
    }

    const result = await updateUserProfile(formData, docId);
    
    if (result.success) {
      Alert.alert(
        '¡Éxito!',
        'Tu perfil ha sido actualizado correctamente',
        [
          {
            text: 'Continuar',
            onPress: () => {
              // Refrescar datos en Home si hay callback
              if (onProfileUpdated) {
                onProfileUpdated();
              }
              // También refrescar datos locales
              refreshUserData();
              navigation.goBack();
            }
          }
        ]
      );
    } else if (result.errors) {
      // Mostrar errores de validación
      setFormErrors(result.errors);
    } else {
      Alert.alert('Error', result.error || 'No se pudieron actualizar los datos');
    }
  };

  const handleCancel = () => {
    const originalData = {
      nombre: userData?.nombre || '',
      edad: userData?.edad || '',
      especialidad: userData?.especialidad || ''
    };

    const currentData = {
      nombre: nombre.trim(),
      edad: edad.trim(),
      especialidad: especialidad.trim()
    };

    if (hasChanges(originalData, currentData)) {
      Alert.alert(
        'Cancelar Cambios',
        '¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.',
        [
          {
            text: 'Continuar Editando',
            style: 'cancel'
          },
          {
            text: 'Cancelar',
            onPress: () => navigation.goBack(),
            style: 'destructive'
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  if (loadingUserData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Editar Perfil</Text>
            <Text style={styles.subtitle}>Actualiza tu información personal</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Nombre completo"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre completo"
              icon="account"
              error={formErrors.nombre}
            />

            <View style={styles.readOnlyContainer}>
              <Input
                label="Correo electrónico"
                value={userData?.correo || user?.email || ''}
                editable={false}
                icon="email"
              />
              <Text style={styles.readOnlyNote}>
                El correo no se puede modificar
              </Text>
            </View>

            <Input
              label="Edad"
              value={edad}
              onChangeText={setEdad}
              placeholder="Tu edad"
              keyboardType="numeric"
              icon="calendar"
              error={formErrors.edad}
            />

            <Input
              label="Especialidad"
              value={especialidad}
              onChangeText={setEspecialidad}
              placeholder="Tu especialidad o profesión"
              icon="school"
              error={formErrors.especialidad}
            />

            {saveError && typeof saveError === 'string' && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{saveError}</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                icon="content-save"
                onPress={handleSave}
                disabled={saving}
                size="large"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>

              <Button
                icon="close"
                onPress={handleCancel}
                variant="secondary"
                size="medium"
                disabled={saving}
              >
                Cancelar
              </Button>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
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
  readOnlyContainer: {
    marginVertical: 8,
  },
  readOnlyNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});
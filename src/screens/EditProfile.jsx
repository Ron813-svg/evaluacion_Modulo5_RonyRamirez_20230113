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
import { getAuth, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { database } from '../config/firebase';
import Button from '../components/Button';
import Input from '../components/Input';

export default function EditProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [docId, setDocId] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (user) {
        const q = query(
          collection(database, 'usuarios'),
          where('uid', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data();
          setUserData(data);
          setDocId(userDoc.id);
          
          // Llenar los campos con los datos actuales
          setNombre(data.nombre || '');
          setEdad(data.edad || '');
          setEspecialidad(data.especialidad || '');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validaciones básicas
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    if (!edad.trim() || isNaN(edad) || parseInt(edad) < 1 || parseInt(edad) > 120) {
      Alert.alert('Error', 'Por favor ingresa una edad válida (1-120)');
      return;
    }

    setSaving(true);

    try {
      // Actualizar el perfil en Firebase Auth
      await updateProfile(user, {
        displayName: nombre.trim()
      });

      // Actualizar los datos en Firestore
      if (docId) {
        const userDocRef = doc(database, 'usuarios', docId);
        await updateDoc(userDocRef, {
          nombre: nombre.trim(),
          edad: edad.trim(),
          especialidad: especialidad.trim()
        });

        Alert.alert(
          '¡Éxito!',
          'Tus datos han sido actualizados correctamente',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
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
  };

  if (loading) {
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
            />

            <Input
              label="Especialidad"
              value={especialidad}
              onChangeText={setEspecialidad}
              placeholder="Tu especialidad o profesión"
              icon="school"
            />

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
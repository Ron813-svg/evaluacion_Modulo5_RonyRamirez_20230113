// hooks/useRegister.js
import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../config/firebase';

export default function useRegister() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [edad, setEdad] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();

  const validateFields = () => {
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return false;
    }

    if (!correo.trim()) {
      setError('El correo es requerido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      setError('Por favor ingresa un correo válido');
      return false;
    }

    if (!password.trim()) {
      setError('La contraseña es requerida');
      return false;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (!edad.trim()) {
      setError('La edad es requerida');
      return false;
    }

    if (isNaN(edad) || parseInt(edad) < 1 || parseInt(edad) > 120) {
      setError('Por favor ingresa una edad válida (1-120)');
      return false;
    }

    if (!especialidad.trim()) {
      setError('La especialidad es requerida');
      return false;
    }

    return true;
  };

  const register = async () => {
    if (!validateFields()) {
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        correo.trim(), 
        password
      );
      const user = userCredential.user;

      // Actualizar nombre en el perfil de Auth
      await updateProfile(user, { 
        displayName: nombre.trim() 
      });

      // Guardar datos extra en Firestore
      await addDoc(collection(database, 'usuarios'), {
        uid: user.uid,
        nombre: nombre.trim(),
        correo: correo.trim(),
        edad: edad.trim(),
        especialidad: especialidad.trim(),
        fechaRegistro: new Date().toISOString()
      });

      return true; // Registro exitoso

    } catch (err) {
      let errorMessage = 'Error al crear la cuenta';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Ya existe una cuenta con este correo';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false; // Registro falló
    } finally {
      setLoading(false);
    }
  };

  return {
    nombre, setNombre,
    correo, setCorreo,
    password, setPassword,
    edad, setEdad,
    especialidad, setEspecialidad,
    loading,
    error,
    register
  };
}
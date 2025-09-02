// hooks/useProfileEdit.js
import { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { database } from '../config/firebase';

export default function useProfileEdit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  // Validar campos del formulario
  const validateFields = (nombre, edad, especialidad) => {
    const errors = {};

    if (!nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (nombre.trim().length > 50) {
      errors.nombre = 'El nombre no puede exceder 50 caracteres';
    }

    if (!edad.trim()) {
      errors.edad = 'La edad es requerida';
    } else if (isNaN(edad) || parseInt(edad) < 1 || parseInt(edad) > 120) {
      errors.edad = 'Por favor ingresa una edad válida (1-120)';
    }

    if (!especialidad.trim()) {
      errors.especialidad = 'La especialidad es requerida';
    } else if (especialidad.trim().length < 2) {
      errors.especialidad = 'La especialidad debe tener al menos 2 caracteres';
    } else if (especialidad.trim().length > 100) {
      errors.especialidad = 'La especialidad no puede exceder 100 caracteres';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Actualizar perfil del usuario
  const updateUserProfile = async (userData, docId = null) => {
    const { nombre, edad, especialidad } = userData;
    
    // Validar campos
    const validation = validateFields(nombre, edad, especialidad);
    if (!validation.isValid) {
      setError(validation.errors);
      return { success: false, errors: validation.errors };
    }

    setLoading(true);
    setError(null);

    try {
      // Actualizar el perfil en Firebase Auth
      await updateProfile(user, {
        displayName: nombre.trim()
      });

      const updatedData = {
        nombre: nombre.trim(),
        edad: edad.trim(),
        especialidad: especialidad.trim(),
        fechaActualizacion: new Date().toISOString()
      };

      // Si existe el documento, actualizarlo
      if (docId) {
        const userDocRef = doc(database, 'usuarios', docId);
        await updateDoc(userDocRef, updatedData);
      } else {
        // Si no existe, crear uno nuevo
        await addDoc(collection(database, 'usuarios'), {
          uid: user.uid,
          correo: user.email,
          ...updatedData,
          fechaRegistro: new Date().toISOString()
        });
      }

      return { success: true, data: updatedData };

    } catch (err) {
      console.error('Error updating profile:', err);
      
      let errorMessage = 'Error al actualizar el perfil';
      
      switch (err.code) {
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet';
          break;
        case 'permission-denied':
          errorMessage = 'No tienes permisos para actualizar estos datos';
          break;
        case 'unavailable':
          errorMessage = 'Servicio no disponible. Intenta más tarde';
          break;
        default:
          errorMessage = err.message || 'Error desconocido';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Verificar si hay cambios en los datos
  const hasChanges = (originalData, newData) => {
    if (!originalData) return true;
    
    return (
      originalData.nombre !== newData.nombre.trim() ||
      originalData.edad !== newData.edad.trim() ||
      originalData.especialidad !== newData.especialidad.trim()
    );
  };

  // Resetear errores
  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    updateUserProfile,
    validateFields,
    hasChanges,
    clearError
  };
}
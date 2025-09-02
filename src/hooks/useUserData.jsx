// hooks/useUserData.js
import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebase';

export default function useUserData() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [docId, setDocId] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  // Función para obtener datos del usuario
  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      return null;
    }

    try {
      setError(null);
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
        return { data, docId: userDoc.id };
      } else {
        // Si no existe el documento, crear uno básico
        const basicData = {
          uid: user.uid,
          nombre: user.displayName || '',
          correo: user.email || '',
          edad: '',
          especialidad: ''
        };
        setUserData(basicData);
        return { data: basicData, docId: null };
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error al cargar los datos del usuario');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para refrescar datos
  const refreshUserData = async () => {
    setLoading(true);
    await fetchUserData();
  };

  // Suscripción en tiempo real a cambios
  const subscribeToUserData = () => {
    if (!user) return null;

    const q = query(
      collection(database, 'usuarios'),
      where('uid', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data();
          setUserData(data);
          setDocId(userDoc.id);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error in user data subscription:', err);
        setError('Error al sincronizar datos');
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (user) {
      fetchUserData();
      // Opcional: suscribirse a cambios en tiempo real
      // const unsubscribe = subscribeToUserData();
      // return unsubscribe;
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    userData,
    docId,
    loading,
    error,
    fetchUserData,
    refreshUserData,
    subscribeToUserData
  };
}
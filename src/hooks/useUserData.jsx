// hooks/useUserData.js
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebase';

export default function useUserData() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [docId, setDocId] = useState(null);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  // Función para obtener datos del usuario
  const fetchUserData = async (currentUser) => {
    if (!currentUser) {
      setUserData(null);
      setDocId(null);
      setLoading(false);
      return null;
    }

    try {
      setError(null);
      const q = query(
        collection(database, 'usuarios'),
        where('uid', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        setUserData(data);
        setDocId(userDoc.id);
        return { data, docId: userDoc.id };
      } else {
        const basicData = {
          uid: currentUser.uid,
          nombre: currentUser.displayName || '',
          correo: currentUser.email || '',
          edad: '',
          especialidad: ''
        };
        setUserData(basicData);
        setDocId(null);
        return { data: basicData, docId: null };
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      let errorMessage = 'Error al cargar los datos del usuario';
      
      if (err.code === 'permission-denied') {
        errorMessage = 'Sin permisos para acceder a los datos';
      } else if (err.code === 'unavailable') {
        errorMessage = 'Servicio no disponible. Intenta más tarde';
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    setLoading(true);
    await fetchUserData(user);
  };

  const subscribeToUserData = (currentUser) => {
    if (!currentUser) return null;

    const q = query(
      collection(database, 'usuarios'),
      where('uid', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data();
          setUserData(data);
          setDocId(userDoc.id);
        } else {
          const basicData = {
            uid: currentUser.uid,
            nombre: currentUser.displayName || '',
            correo: currentUser.email || '',
            edad: '',
            especialidad: ''
          };
          setUserData(basicData);
          setDocId(null);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        fetchUserData(currentUser);
      } else {
        setUserData(null);
        setDocId(null);
        setError(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return {
    userData,
    docId,
    loading,
    error,
    user, 
    fetchUserData,
    refreshUserData,
    subscribeToUserData
  };
}
// hooks/useLogin.js
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth();

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Aquí podrías redirigir o manejar el usuario logueado
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    login
  };
}


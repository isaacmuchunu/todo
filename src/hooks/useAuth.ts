import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../lib/firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await loginUser(email, password);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      await registerUser(email, password);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await logoutUser();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  };
};
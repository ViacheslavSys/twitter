import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';
import type { User, LoginResponse } from '../types/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: User): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token } = response.data;
      localStorage.setItem('auth_token', token); // или sessionStorage
      return token;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          setError('Неверный логин или пароль');
        } else {
          setError('Ошибка сети или сервера');
        }
      } else {
        setError('Неизвестная ошибка');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
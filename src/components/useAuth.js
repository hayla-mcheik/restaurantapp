import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAuth() { // Explicitly export the hook
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        setToken(storedToken);
        setIsAuthenticated(!!storedToken); // Check for token existence
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    retrieveToken();
  }, []); // Empty dependency array to run only once

  const attachTokenToRequest = async (request) => {
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  };

  return { token, isAuthenticated, attachTokenToRequest };
}

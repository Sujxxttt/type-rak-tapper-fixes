
import { useState, useEffect } from 'react';

export const useUsername = () => {
  const [username, setUsername] = useState<string>('Guest');

  useEffect(() => {
    const savedUsername = localStorage.getItem('typewave-username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('typewave-username', newUsername);
  };

  return {
    username,
    updateUsername
  };
};

import { getCurrentUser } from '@/lib/services/api';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Define a flexible user type
type DynamicUser = Record<string, unknown> & {
  _id: string;
  username: string;
  email: string;
  following: Array<{ _id: string }>;  // Add this line
};

interface UserContextType {
  currentUser: DynamicUser | null;
  setCurrentUser: (user: DynamicUser | null) => void;
  isLoading: boolean;
  refetchCurrentUser: () => Promise<void>;  // Add this line
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<DynamicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const refetchCurrentUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isLoading, refetchCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCurrentUserContext must be used within a UserProvider');
  }
  return context;
};
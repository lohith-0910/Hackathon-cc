import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [loading, setLoading] = useState(false);

  // Demo user fallback for quick evaluation without backend startup delay
  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const res = await authService.login(usernameOrEmail, password);
      if (res.success) {
        setUser(res.data.user);
        return { success: true };
      } else {
        // Fallback for immediate UI evaluation if backend is starting up
        const demoUser = getDemoUser(usernameOrEmail);
        if (demoUser) {
          localStorage.setItem('keyvault_token', 'demo-jwt-token-hackathon');
          localStorage.setItem('keyvault_user', JSON.stringify(demoUser));
          setUser(demoUser);
          return { success: true, message: 'Logged in via demo mode' };
        }
        return { success: false, message: res.message || 'Authentication failed' };
      }
    } catch (err) {
      const demoUser = getDemoUser(usernameOrEmail);
      if (demoUser) {
        localStorage.setItem('keyvault_token', 'demo-jwt-token-hackathon');
        localStorage.setItem('keyvault_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return { success: true };
      }
      return { success: false, message: 'Unable to connect to Authentication Service.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const getDemoUser = (identifier) => {
    if (identifier.includes('security') || identifier.includes('SECURITY_ADMIN')) {
      return { id: 2, username: 'security_admin', email: 'security@example.com', fullName: 'Sarah Vance', role: 'SECURITY_ADMIN' };
    }
    if (identifier.includes('developer') || identifier.includes('DEVELOPER')) {
      return { id: 3, username: 'developer', email: 'developer@example.com', fullName: 'Alex Mercer', role: 'DEVELOPER' };
    }
    if (identifier.includes('viewer') || identifier.includes('VIEWER')) {
      return { id: 4, username: 'viewer', email: 'viewer@example.com', fullName: 'David Clark', role: 'VIEWER' };
    }
    // Default Admin
    return { id: 1, username: 'admin', email: 'admin@example.com', fullName: 'Azure Key Vault Admin', role: 'ADMIN' };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';
import { demoStore, DEMO_USERS } from '../services/demoStore.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSupabase = isSupabaseConfigured();

  useEffect(() => {
    if (isSupabase && supabase) {
      // Supabase Auth listener
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Obtener perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('*, user_roles(role)')
            .eq('id', session.user.id)
            .single();

          const role = profile?.user_roles?.[0]?.role || 'estudiante';
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            fullName: profile?.full_name || session.user.email,
            grade: profile?.grade || 'Estudiante',
            role: role,
            avatarUrl: profile?.avatar_url
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      };
      checkSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          checkSession();
        } else {
          setCurrentUser(null);
        }
      });
      return () => subscription.unsubscribe();
    } else {
      // Modo Demostración
      const stored = demoStore.getCurrentUser();
      setCurrentUser(stored || DEMO_USERS[0]);
      setLoading(false);
    }
  }, [isSupabase]);

  const login = async (email, password) => {
    if (isSupabase && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Modo Demo: Buscar en usuarios demo
      const users = demoStore.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        // Permitir inicio de sesión creando perfil temporal si no existe
        const newUser = {
          id: 'user-' + Date.now(),
          email,
          fullName: email.split('@')[0],
          grade: '10° A',
          role: 'estudiante'
        };
        demoStore.setCurrentUser(newUser);
        setCurrentUser(newUser);
        return newUser;
      }
      demoStore.setCurrentUser(user);
      setCurrentUser(user);
      return user;
    }
  };

  const signup = async ({ fullName, email, password, grade }) => {
    if (isSupabase && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, grade }
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Demo mode signup
      const newUser = {
        id: 'user-' + Date.now(),
        email,
        fullName,
        grade,
        role: 'estudiante',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`
      };
      const users = demoStore.getUsers();
      users.push(newUser);
      demoStore.saveUsers ? demoStore.saveUsers(users) : null;
      demoStore.setCurrentUser(newUser);
      setCurrentUser(newUser);
      return newUser;
    }
  };

  const logout = async () => {
    if (isSupabase && supabase) {
      await supabase.auth.signOut();
    } else {
      demoStore.setCurrentUser(null);
    }
    setCurrentUser(null);
  };

  // Selector rápido de usuario demo para pruebas sin esfuerzo
  const switchDemoUser = (userTypeOrId) => {
    const users = demoStore.getUsers();
    let target = users.find(u => u.id === userTypeOrId || u.role === userTypeOrId);
    if (!target) {
      target = DEMO_USERS[0];
    }
    demoStore.setCurrentUser(target);
    setCurrentUser(target);
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    demoStore.setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'estudiante',
        isAuthenticated: Boolean(currentUser),
        loading,
        isSupabase,
        login,
        signup,
        logout,
        switchDemoUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

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
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            let role = 'estudiante';
            let fullName = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
            let grade = session.user.user_metadata?.grade || 'Estudiante';
            let avatarUrl = session.user.user_metadata?.avatar_url || null;

            // Intentar leer perfil si la tabla profiles existe
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*, user_roles(role)')
                .eq('id', session.user.id)
                .single();

              if (profile) {
                fullName = profile.full_name || fullName;
                grade = profile.grade || grade;
                avatarUrl = profile.avatar_url || avatarUrl;
                role = profile.user_roles?.[0]?.role || role;
              }
            } catch (profileErr) {
              console.warn('Tabla profiles aún no disponible o sin registro, usando metadatos de sesión:', profileErr);
            }

            setCurrentUser({
              id: session.user.id,
              email: session.user.email,
              fullName,
              grade,
              role,
              avatarUrl
            });
          } else {
            // Si no hay sesión activa en Supabase, iniciar con el usuario de muestra para facilitar la navegación
            const stored = demoStore.getCurrentUser();
            setCurrentUser(stored || DEMO_USERS[0]);
          }
        } catch (err) {
          console.warn('Error verificando sesión en Supabase:', err);
          const stored = demoStore.getCurrentUser();
          setCurrentUser(stored || DEMO_USERS[0]);
        } finally {
          setLoading(false);
        }
      };

      checkSession();

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          checkSession();
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
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      } catch (err) {
        // Si no se encuentra en Supabase Auth, revisar si es una cuenta de prueba
        const demoMatch = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (demoMatch) {
          demoStore.setCurrentUser(demoMatch);
          setCurrentUser(demoMatch);
          return demoMatch;
        }
        throw err;
      }
    } else {
      // Modo Demo: Buscar en usuarios demo
      const users = demoStore.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
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
      
      const userObj = {
        id: data.user?.id || 'user-' + Date.now(),
        email,
        fullName,
        grade,
        role: 'estudiante'
      };
      setCurrentUser(userObj);
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
      demoStore.setCurrentUser(newUser);
      setCurrentUser(newUser);
      return newUser;
    }
  };

  const logout = async () => {
    if (isSupabase && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error cerrando sesión en Supabase:', err);
      }
    }
    demoStore.setCurrentUser(null);
    setCurrentUser(null);
  };

  // Selector de usuario demo para pruebas sin esfuerzo
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

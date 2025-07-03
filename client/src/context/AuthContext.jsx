// client/src/context/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'LOAD_USER':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        token: authService.getToken()
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = () => {
      if (authService.isAuthenticated()) {
        const user = authService.getUser();
        dispatch({ type: 'LOAD_USER', payload: user });
      }
    };
    loadUser();
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    
    const result = await authService.register(userData);
    
    if (result.success) {
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: result.user, token: result.token }
      });
      toast.success('Registration successful!');
      return { success: true };
    } else {
      dispatch({ type: 'REGISTER_FAILURE', payload: result.message });
      toast.error(result.message);
      return { success: false, message: result.message };
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    const result = await authService.login(credentials);
    
    if (result.success) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: result.user, token: result.token }
      });
      toast.success('Login successful!');
      return { success: true };
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: result.message });
      toast.error(result.message);
      return { success: false, message: result.message };
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully!');
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
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

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'LOGIN_FAIL':
      return { ...state, loading: false, user: null, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, error: null, loading: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      } else {
        dispatch({ type: 'LOGIN_FAIL', payload: data.message });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Network error' });
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      } else if (data.verificationRequired) {
        dispatch({ type: 'LOGIN_FAIL', payload: null });
        return data;
      } else {
        dispatch({ type: 'LOGIN_FAIL', payload: data.message });
      }
      return data;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Network error' });
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await fetch(`${API_BASE_URL}/api/users/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      } else {
        dispatch({ type: 'LOGIN_FAIL', payload: data.message });
      }
      return data;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Network error' });
    }
  };

  const updateProfile = async (name, email, password, currentPassword, phone, billingAddress, shippingAddress) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, currentPassword, phone, billingAddress, shippingAddress }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      } else {
        dispatch({ type: 'LOGIN_FAIL', payload: data.message });
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Network error' });
    }
  };

  const forgotPassword = async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'LOGOUT' });
  };

  const signupInit = async (name, email, phone) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await fetch(`${API_BASE_URL}/api/users/signup-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch({ type: 'LOGIN_FAIL', payload: data.message });
      } else {
        dispatch({ type: 'LOGIN_FAIL', payload: null });
      }
      return data;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Network error' });
    }
  };

  const verifySignupOTP = async (email, otp) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await fetch(`${API_BASE_URL}/api/users/verify-signup-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch({ type: 'LOGIN_FAIL', payload: data.message });
      } else {
        dispatch({ type: 'LOGIN_FAIL', payload: null });
      }
      return data;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Network error' });
    }
  };

  const signupComplete = async (email, password, otp) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await fetch(`${API_BASE_URL}/api/users/signup-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      } else {
        dispatch({ type: 'LOGIN_FAIL', payload: data.message });
      }
      return data;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAIL', payload: 'Network error' });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, verifyEmail, signupInit, verifySignupOTP, signupComplete, updateProfile, forgotPassword, resetPassword, logout }}>
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

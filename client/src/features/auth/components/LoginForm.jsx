import React, { useState } from 'react';
import { useAuth } from '../authHooks';
import { TextInput } from '@/common/inputs/TextInput';
import { PrimaryButton } from '@/common/buttons/PrimaryButton';

import { hideLoading, showLoading } from "../../../redux/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

export const LoginForm = () => {

  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.value);

  const onChange = (e) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoading())
    setError('');

    const result = await login(userData);
    
    if (!result.success) {
      setError(result.error);
    }
    
    dispatch(hideLoading())
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          name="email"
          type="email"
          onChange={onChange}
          required
        />
        
        <TextInput
          label="Password"
          name="password"
          type="password"
          onChange={onChange}
          required
        />
        
        <PrimaryButton
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Logging in...' : 'Login'}
        </PrimaryButton>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
};
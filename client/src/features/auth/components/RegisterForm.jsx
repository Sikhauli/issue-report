import React, { useState } from 'react';
import { useAuth } from '../authHooks';
import { TextInput } from '@/common/inputs/TextInput';
import { PrimaryButton } from '@/common/buttons/PrimaryButton';

import { hideLoading, showLoading } from "../../../redux/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

export const RegisterForm = () => {

  const [data, setData] = useState({});  
  const [error, setError] = useState('');
  const { register } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.value);

  const onChange = (e) => {
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(showLoading())
    setError('');

    try {
      await register(data);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      dispatch(hideLoading())
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          name="name"
          type="text"
          onChange={onChange}
          required
        />

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
          {loading ? 'Registering...' : 'Register'}
        </PrimaryButton>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
};

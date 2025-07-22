import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { LoginCredentials } from '../types/index.ts';
import { useAuth } from '../contexts/AuthContext';

const schema = yup.object().shape({
  username: yup.string().required('Kullanıcı adı gerekli'),
  password: yup.string().required('Şifre gerekli'),
});

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setError('Geçersiz kullanıcı adı veya şifre');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 border border-blue-100 flex flex-col items-center animate-fade-in">
        {/* Logo veya ikon */}
        <div className="mb-6 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 shadow-inner overflow-hidden">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-2.5 4-4 8-4s8 1.5 8 4" /></svg>
        </div>
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight text-center">Giriş Yap</h1>
        <p className="text-gray-500 mb-6 text-center">Talep Yönetimi Sistemine Hoş Geldiniz</p>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-2 text-center">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Kullanıcı Adı</label>
            <input
              type="text"
              {...register('username')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 placeholder-gray-400 text-gray-800 transition"
              autoComplete="username"
              required
              placeholder="Kullanıcı adınızı girin"
            />
            {errors.username && <div className="text-xs text-red-600 mt-1">{errors.username.message}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Şifre</label>
            <input
              type="password"
              {...register('password')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50 placeholder-gray-400 text-gray-800 transition"
              autoComplete="current-password"
              required
              placeholder="Şifrenizi girin"
            />
            {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password.message}</div>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 shadow-lg transition text-lg mt-2 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}; 
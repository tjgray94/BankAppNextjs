'use client';
import React from 'react'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import axios from 'axios'

type LoginFormInputs = {
  email: string;
  pin: string;
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const router = useRouter();

  const handleLogin: SubmitHandler<LoginFormInputs> = async (data: { email: string; pin: string }) => {
    const { email, pin } = data;

    try {
      const response = await axios.post('/api/login', { email, pin });
      if (response.data.authenticated) {
        console.log('User authenticated', response.data);
        const userId = response.data.userId;
        localStorage.setItem('userId', userId);
        router.push(`/account/${userId}`);
      } else {
        console.error('Authentication failed');
        alert('Invalid email or PIN');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      alert('Error during authentication. Please try again.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="relative flex flex-col items-center bg-gray-800 shadow-lg border border-gray-700 w-96 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-500">Login</h2>
        <form onSubmit={handleSubmit(handleLogin)} className="w-full">
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Enter a valid email',
                  },
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
            <label htmlFor="pin" className="block mb-1 text-sm font-medium text-gray-300">PIN</label>
              <input
                type="password"
                {...register('pin', {
                  required: 'PIN is required',
                  pattern: {
                    value: /^\d{4}$/,
                    message: 'PIN must be a 4-digit number',
                  },
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 p-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.pin && <p className="mt-1 text-red-500 text-sm">{errors.pin.message}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed">Login</button>
            <button type="button" onClick={() => router.back()} className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-gray-200 font-semibold py-2 rounded-lg transition-all focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">Back</button>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?
            <Link href="/signup" className="text-blue-500 underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
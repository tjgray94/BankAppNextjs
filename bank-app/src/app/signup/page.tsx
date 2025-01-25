'use client'
import React, { ReactNode } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function SignupPage() {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      pin: '',
      accountType: 'both',
      checkingBalance: 0,
      savingsBalance: 0
    }
  })

  const onSignup = async (data:any) => {
    try {
      const response = await axios.post('/api/users', {
        ...data,
        checkingBalance: data.checkingBalance || 0,
        savingsBalance: data.savingsBalance || 0
      })

      if (response.status === 201) {
        alert('Account created successfully!');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Failed to create account.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Create a New Account</h2>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSignup)} className="space-y-6">
          <div className="grid md:grid-cols-2 md:gap-6">
            {/* First Name */}
            <div className="relative z-0 w-full mb-5 group">
              <input type="text"
                {...methods.register("firstName", {
                  required: "First name is required",
                  minLength: { value: 2, message: "First name must be at least 2 characters" },
                  pattern: { value: /^[a-zA-Z]+$/, message: "Only letters are allowed" },
                })} 
                className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:focus:border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" "
              />
              <label htmlFor="firstName" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First Name</label>
              {methods.formState.errors.firstName && (
                <span className="text-red-500 text-sm">
                  {methods.formState.errors.firstName.message}
                </span>
              )}
            </div>
            {/* Last Name */}
            <div className="relative z-0 w-full mb-5 group">
              <input type="text" name="lastName" className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:focus:border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" " />
              <label htmlFor="lastName" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last Name</label>
              {methods.formState.errors.lastName && (
                <span className="text-red-500 text-sm">
                  {methods.formState.errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          {/* Email */}
          <div className="relative z-0 w-full mb-5 group">
            <input type="email" 
              {...methods.register("email", {
                required: "Email is required",
                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Enter a valid email address" },
              })}
              className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:focus:border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" "
            />
            <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
            {methods.formState.errors.email && (
              <span className="text-red-500 text-sm">
                {methods.formState.errors.email.message}
              </span>
            )}
          </div>
          {/* Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input type="password" 
              {...methods.register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
              className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:focus:border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" " 
            />
            <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            {methods.formState.errors.password && (
              <span className="text-red-500 text-sm">
                {methods.formState.errors.password.message}
              </span>
            )}
          </div>
          {/* PIN */}
          <div className="relative z-0 w-full mb-5 group">
            <input type="password" 
              {...methods.register("pin", {
                required: "PIN is required",
                minLength: { value: 4, message: "PIN must be exactly 4 digits" },
                maxLength: { value: 4, message: "PIN must be exactly 4 digits" },
                pattern: { value: /^\d{4}$/, message: "PIN must contain only numbers" }
              })}
              className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none dark:focus:border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" " 
            />
            <label htmlFor="pin" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">PIN</label>
            {methods.formState.errors.pin && (
              <span className="text-red-500 text-sm">
                {methods.formState.errors.pin.message}
              </span>
            )}
          </div>

          <label className="block text-sm font-medium text-gray-100">Account Type</label>
          <div className="mt-2 space-x-4">
            <label className="text-gray-200">
              <input type="radio" value="checking" {...methods.register('accountType')} 
                className="focus:ring-blue-500 focus:ring-2 text-blue-600"
              /> Checking
            </label>
            <label className="text-gray-200">
              <input type="radio" value="savings" {...methods.register('accountType')} 
              className="focus:ring-blue-500 focus:ring-2 text-blue-600"
            /> Savings
            </label>
            <label className="text-gray-200">
              <input type="radio" value="both" {...methods.register('accountType')} 
              className="focus:ring-blue-500 focus:ring-2 text-blue-600"
            /> Both
            </label>
          </div>

          {(methods.watch('accountType') === 'checking' || methods.watch('accountType') === 'both') && (
            <div className="relative z-0 w-full mb-5 group">
              <input type="number" 
                {...methods.register("checkingBalance", {
                  required: "Starting balance is required",
                  min: { value: 0, message: "Balance must be at least 0"}
                })}
                className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" " 
              />
              <label htmlFor="checkingBalance" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Starting Checking Balance</label>
              {methods.formState.errors.checkingBalance && (
                <span className="text-red-500 text-sm">
                  {methods.formState.errors.checkingBalance.message}
                </span>
              )}
            </div>
          )}
          {(methods.watch('accountType') === 'savings' || methods.watch('accountType') === 'both') && (
            <div className="relative z-0 w-full mb-5 group">
              <input type="number" 
                {...methods.register("savingsBalance", {
                  required: "Starting balance is required",
                  min: { value: 0, message: "Balance must be at least 0"}
                })}
                className="block py-2.5 px-0 w-full text-sm text-gray-100 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer" placeholder=" " 
              />
              <label htmlFor="savingsBalance" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Starting Savings Balance</label>
              {methods.formState.errors.savingsBalance && (
                <span className="text-red-500 text-sm">
                  {methods.formState.errors.savingsBalance.message}
                </span>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Create Account</button>
            <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-gray-600 text-gray-100 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">Back</button>
          </div>
          <div className="mt-4 text-center"> 
            <Link href='/login' className="text-blue-500 hover:text-blue-700">Already have an account? Go to Login Page</Link>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
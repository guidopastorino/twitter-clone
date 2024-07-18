"use client"

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { FormEvent, useState } from 'react';

const SignInPage = () => {
  const [error, setError] = useState<string>("");

  const handleSignIn = async (provider: string) => {
    const response = await signIn(provider, { redirect: false, callbackUrl: '/' });

    if (response?.error) {
      setError(response.error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    const response = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: false
    });

    if (response?.ok) {
      if (typeof window != undefined) {
        window.location.href = "/";
      }
    }

    console.log(response)

    if (response?.error) {
      setError(response.error);
    }
  };

  return (
    <div className='h-dvh w-full flex justify-center items-center flex-col gap-4'>
      <span className='font-medium text-3xl mb-3'>Sign In</span>

      {/* credentials */}
      <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col gap-3'>
        <input id='email' name='email' type="email" className="outline outline-1 dark:outline-gray-500 outline-gray-900 py-3 px-4 w-full rounded-full h-10" placeholder='Email or username' />
        <input id='password' name='password' type="password" className="outline outline-1 dark:outline-gray-500 outline-gray-900 py-3 px-4 w-full rounded-full h-10" placeholder='Password' />
        <button type='submit' className='px-4 py-2 text-white shadow-lg bg-blue-700 font-bold hover:bg-blue-600 duration-75 rounded-full'>Login</button>
        {error && <div className="p-2 bg-red-600 text-white text-center">{error}</div>}
      </form>

      <div>or</div>

      <button onClick={() => handleSignIn("github")} className='px-4 py-2 text-white shadow-lg bg-blue-700 font-bold hover:bg-blue-600 duration-75 rounded-full'>Sign in with GitHub</button>
      <button onClick={() => handleSignIn("google")} className='px-4 py-2 text-white shadow-lg bg-blue-700 font-bold hover:bg-blue-600 duration-75 rounded-full'>Sign in with Google</button>

      <div className="block p-5">New user? <Link href={"/register"} className='underline hover:no-underline'>Register</Link></div>
    </div>
  );
};

export default SignInPage;

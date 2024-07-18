"use client"

import axios from 'axios';
import Link from 'next/link';
import React, { FormEvent } from 'react'

const page = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fullname = (e.currentTarget.elements.namedItem('fullname') as HTMLInputElement).value;
    const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    console.log(fullname, username, email, password);

    try {
      const response = await axios.post("/api/users", { fullname, username, email, password });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='h-dvh w-full flex justify-center items-center flex-col gap-4'>
      <span className='font-medium text-3xl mb-3'>Register</span>
      <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col gap-3'>
        <input id='fullname' type="text" className="outline outline-1 dark:outline-gray-500 outline-gray-900 py-3 px-4 w-full rounded-full h-10" placeholder='Full name' />
        <input id='username' type="text" className="outline outline-1 dark:outline-gray-500 outline-gray-900 py-3 px-4 w-full rounded-full h-10" placeholder='Username' />
        <input id='email' type="text" className="outline outline-1 dark:outline-gray-500 outline-gray-900 py-3 px-4 w-full rounded-full h-10" placeholder='Email' />
        <input id='password' type="password" className="outline outline-1 dark:outline-gray-500 outline-gray-900 py-3 px-4 w-full rounded-full h-10" placeholder='Password' />
        <button type='submit' className='px-4 py-2 text-white shadow-lg bg-blue-700 font-bold hover:bg-blue-600 duration-75 rounded-full'>Register</button>
      </form>
      <div className="block p-5">Already registered? <Link href={"/signin"} className='underline hover:no-underline'>Sign in</Link></div>
    </div>
  )
}

export default page;

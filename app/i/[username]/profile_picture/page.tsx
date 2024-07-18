"use client"

import Loader, { PagesLoader } from '@/components/Loader';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'

const page = ({ params }: { params: { username: string } }) => {
  const [profileImage, setProfileImage] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${params.username}`)
        if (response.status !== 200) {
          throw new Error("Error fetching the user data")
        }
        setProfileImage(response.data.profileImage)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    getUserData();
  }, [])

  if (loading) {
    return <PagesLoader />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className='w-full h-dvh flex justify-center items-center bg-black/90 backdrop-blur-sm fixed top-0 left-0 z-50'>
      <button onClick={() => window.history.back()} className='dark:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg absolute top-5 left-5'><RxCross2 /></button>

      <img className='w-60 h-60 rounded-full object-cover shrink-0' src={profileImage || "/default_profile_picture.jpg"} alt={`${params.username}'s profile picture`} />

    </div>
  )
}

export default page
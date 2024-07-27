// show user's profile
// render if it is our profile (edit mode) or other user's profile

"use client"

import { PagesLoader } from '@/components/Loader';
import EditAccount from '@/components/RouteModals/EditAccount';
import { useModal } from '@/hooks/useModal';
import { UserType } from '@/types/types'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { useQuery } from 'react-query';
// 
import { BsThreeDots, CgArrowLeft, MdModeEditOutline } from '@/constants/icons';


const fetchUser = async (username: string) => {
  try {
    const response = await axios.get(`/api/users/${username}`)
    if (response.status !== 200) {
      throw new Error("Error fetching the user data")
    }
    return response.data
  } catch (error) {
    console.log(error instanceof Error ? error.message : "Unknown error")
  }
}

const ProfileLayout = ({ username }: { username: string }) => {
  const { data: session } = useSession()

  const { data: user, isLoading, error } = useQuery<UserType, Error>(
    ['userProfile', username],
    () => fetchUser(username),
    { enabled: !!username }
  )

  const { openRouteModal } = useModal()

  const pathname = usePathname()

  if (!username) return <div>Username is required</div>

  if (isLoading) {
    return <PagesLoader />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <>
      {/* navbar */}
      <div className="w-full flex justify-between items-center gap-3 bg-white/60 dark:bg-black/60 backdrop-blur-sm sticky z-30 top-0 h-12 select-none">
        <div className="flex justify-center items-center gap-2">
          <button onClick={() => window.history.back()} className='dark:hover:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg'><CgArrowLeft /></button>
          <span className="font-medium">
            {user.fullname}
          </span>
        </div>
        {/* button modañ */}
        <button onClick={() => openRouteModal(<EditAccount />, "/account/edit")} className='bg-white text-black rounded-full w-10 h-10 flex justify-center items-center text-lg duration-100 active:scale-95'>
          <MdModeEditOutline />
        </button>
      </div>

      {/* user info */}
      <div className='flex justify-center items-start gap-3 p-3 w-full'>
        <div className='shrink-0 self-start'>
          <Link href={`/i/${username}/profile_picture`}>
            <img className='w-32 h-32 rounded-full object-cover shrink-0' src={user.profileImage || "/default_profile_picture.jpg"} alt={`${user.username}'s profile picture`} />
          </Link>
        </div>
        {/*  */}
        <div className='w-full flex flex-col gap-5 justify-start items-center mx-auto max-w-[350px]'>
          {/* username & btns */}
          <div className='flex justify-between items-center gap-2 w-full'>
            <span>{username}</span>
            <div className='flex justify-center items-center gap-2'>
              <button className="py-2 px-4 text-sm bg-neutral-800 rounded-lg dark:text-white active:brightness-90">Following</button>
              <button className="py-2 px-4 text-sm bg-neutral-800 rounded-lg dark:text-white active:brightness-90">Message</button>
              <button className="w-8 h-8 text-sm flex justify-center items-center rounded-full dark:text-white dark:hover:bg-neutral-800 duration-75"><BsThreeDots /></button>
            </div>
          </div>
          {/* statistics */}
          <div className='flex justify-between items-center gap-3 w-full'>
            <div className="flex justify-center items-center gap-1">
              <span className='dark:text-white font-medium'>{user.posts.length}</span>
              <Link className='opacity-70 hover:underline' href={`/i/${username}`}>Posts</Link>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className='dark:text-white font-medium'>{user.followers.length}</span>
              <Link className='opacity-70 hover:underline' href={`/i/${username}/followers`}>Followers</Link>
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className='dark:text-white font-medium'>{user.following.length}</span>
              <Link className='opacity-70 hover:underline' href={`/i/${username}/following`}>Following</Link>
            </div>
          </div>
          {/* description */}
          <div></div>
        </div>
      </div>

      {/* tabs */}
      <div className='grid grid-cols-3 border-y border-neutral-800 mt-5 select-none'>
        <Link href={`/i/${username}`} className={`${pathname.endsWith(username) && "bg-neutral-800"} inline-block cursor-pointer text-center p-2 dark:hover:bg-neutral-800 active:dark:brightness-90 dark:text-white`}>Posts</Link>
        <Link href={`/i/${username}/replies`} className={`${pathname.endsWith('replies') && "bg-neutral-800"} inline-block cursor-pointer text-center p-2 dark:hover:bg-neutral-800 active:dark:brightness-90 dark:text-white`}>Replies</Link>
        <Link href={`/i/${username}/media`} className={`${pathname.endsWith('media') && "bg-neutral-800"} inline-block cursor-pointer text-center p-2 dark:hover:bg-neutral-800 active:dark:brightness-90 dark:text-white`}>Media</Link>
      </div>
    </>
  )
}

export default ProfileLayout
"use client"

import { PagesLoader } from '@/components/Loader'
import { PostType } from '@/types/types'
import axios from 'axios'
import React from 'react'
import { useQuery } from 'react-query'

const fetchUserPosts = async (userId: string) => {
  try {
    const response = await axios.get(`/api/users/${userId}/posts`)
    if (response.status != 200) {
      throw new Error("Error while fetching user posts")
    }
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const page = ({ params }: { params: { username: string } }) => {
  const { data, isLoading, error } = useQuery<PostType[], Error>(
    ['userPosts', params.username],
    () => fetchUserPosts(params.username),
    { enabled: !!params.username },
  )

  if (isLoading) return <PagesLoader />

  if (error) return <div>{error.message}</div>

  if (!data || data.length == 0) return <div className='px-5 py-3 text-center dark:text-neutral-600 text-slate-500'>@{params.username} hasn't posted yet.</div>

  return (
    <div>{params.username}</div>
  )
}

export default page
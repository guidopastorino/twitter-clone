"use client"

import PostComment from '@/components/Posts/PostComment'
import { CommentsActivity } from '@/types/types'
import { fetchUserComments } from '@/utils/api/fetchFunctions'
import React from 'react'
import { useQuery } from 'react-query'

const page = ({ params }: { params: { username: string } }) => {
  const { data: userComments, isLoading, error } = useQuery<CommentsActivity[], Error>(
    ['userComments', params.username],
    () => fetchUserComments(params.username),
    { enabled: !!params.username }
  )

  if(!userComments || !userComments.length) return <div>No comments</div>

  if(error) return <div>Error: {error.message}</div>

  return (
    <div>
      {userComments.map((comment, i) => (
        <PostComment key={i} {...comment} />
      ))}
    </div>
  )
}

export default page
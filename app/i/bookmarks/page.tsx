"use client"

import DropdownMenu from '@/components/DropdownMenu'
import { PagesLoader } from '@/components/Loader'
import Post from '@/components/Post'
import useToast from '@/hooks/useToast'
import { PostType } from '@/types/types'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { BsThreeDots, CgArrowLeft, IoSearchOutline } from '@/constants/icons'
import { useQuery, useMutation, useQueryClient } from 'react-query'

// id: user id
// devuelve una lista con los posts que el usuario ha guardado
const fetchUserBookmarks = async (id: string): Promise<PostType[]> => {
  const response = await axios.get(`/api/users/${id}/bookmarks`)
  return response.data
}

// Función para eliminar todos los bookmarks de un usuario
const clearUserBookmarks = async (userId: string) => {
  const response = await axios.delete(`/api/users/${userId}/bookmarks`);
  return response.data;
}

const page = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id

  const { data, isLoading, error } = useQuery<PostType[], Error>(
    ['userBookmarks', userId],
    () => fetchUserBookmarks(userId || ""),
    { enabled: !!userId }
  )

  useEffect(() => console.log("User bookmarks: ", data), [data])

  const { showToast } = useToast()

  // optimismo para que al eliminar se muestre los bookmarks vacios
  const mutation = useMutation(() => clearUserBookmarks(userId || ""), {
    onMutate: async () => {
      await queryClient.cancelQueries(['userBookmarks', userId])
      const previousBookmarks = queryClient.getQueryData<PostType[]>(['userBookmarks', userId])
      queryClient.setQueryData(['userBookmarks', userId], [])
      return { previousBookmarks }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['userBookmarks', userId], context?.previousBookmarks)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['userBookmarks', userId])
    },
  });

  const handleClearBookmarks = () => {
    mutation.mutate()
    showToast("All bookmarks cleared successfully")
  };

  if (isLoading) return <PagesLoader />

  return (
    <>
      <div className="flex justify-between items-center gap-3 w-full sticky top-0 z-40 backdrop-blur-sm bg-black/60 p-2">
        <div className='flex justify-center items-center gap-3'>
          <button onClick={() => window.history.back()} className='dark:hover:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg'><CgArrowLeft /></button>
          <span className="font-medium text-lg">
            Bookmarks
          </span>
        </div>
        {/* search bookmarks btn */}
        <div className='flex justify-center items-center gap-3'>
          <div className='cursor-pointer dark:hover:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg'>
            <IoSearchOutline />
          </div>
          <DropdownMenu button={<button data-popup='Options' className='dark:hover:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg'><BsThreeDots /></button>}>{(MenuRef, menu, setMenu) => (
            <>
              {menu && <div ref={MenuRef} className='py-1 bg-neutral-800 rounded-lg overflow-hidden'>
                <div onClick={() => {
                  setMenu(!menu)
                  handleClearBookmarks()
                }} className='w-max px-3 py-2 bg-neutral-800 active:brightness-95 cursor-pointer hover:bg-neutral-700'>Clear all bookmarks</div>
              </div>}
            </>
          )}</DropdownMenu>
        </div>
      </div>
      <div>
        {(!data || data.length == 0) && <div className="px-5 py-3 text-center dark:text-neutral-600 text-slate-500">No posts bookmarked yet. Start bookmarking posts to see them here!</div>}
      </div>
      {/* render posts */}
      {data?.map((post, i) => (
        <Post key={i} {...post} />
      ))}
    </>
  )
}

export default page

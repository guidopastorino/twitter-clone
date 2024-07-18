import { PostType } from '@/types/types';
import React, { useEffect } from 'react';
import Loader from '@/components/Loader';
import Post from '@/components/Post';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchFollowingPosts = async (userId: string): Promise<PostType[]> => {
  const response = await axios.get(`/api/posts/following`, { params: { userId } });
  return response.data;
}

const FollowingPosts = () => {
  const user = useSelector((state: RootState) => state.user);

  const { data, error, isLoading } = useQuery<PostType[], Error>(
    ['followingPosts', user._id],
    () => fetchFollowingPosts(user._id as string), // Asegúrate de que user._id es un string
    { enabled: !!user._id } // Habilitar la consulta solo si user._id está definido
  );

  useEffect(() => console.log(data), [data])

  if (isLoading) return <Loader />;

  if (error) return <div>Error: {error.message}</div>;

  if (!data || data.length === 0) return <div className='px-5 py-3 text-center dark:text-neutral-600 text-slate-500'>No posts to show in following tab. Start following people or wait until they post something!</div>;

  return (
    <div role='main' className='w-full'>
      {data?.map((post: PostType, i: number) => (
        <Post key={i} {...post} />
      ))}
    </div>
  );
};

export default FollowingPosts
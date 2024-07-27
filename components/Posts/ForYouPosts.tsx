import React, { useEffect } from 'react';
import Loader from '@/components/Loader';
import Post from '@/components/Post';
import useInfiniteScroll from '@/hooks/useInfiniteScroll'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import { PostType } from '@/types/types';
import { fetchForYouPosts } from '@/utils/api/fetchFunctions';

const ForYouPosts: React.FC = () => {
  const cacheKey = 'forYouPosts';
  const { data, error, status, isFetchingNextPage, hasNextPage, lastPostElementRef } = useInfiniteScroll({
    cacheKey,
    fetchFunction: fetchForYouPosts
  });

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  if (status === 'loading') return <Loader />;
  if (status === 'error') return <div>Error: {error?.message}</div>;

  const isEmpty = !data || data.pages.every(page => page.length === 0);

  if (isEmpty) return <div className='px-5 py-3 text-center dark:text-neutral-600 text-slate-500'>No posts to show. Start posting something!</div>;

  return (
    <div role='main' className='w-full'>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.map((post: PostType, j: number) => (
            <Post key={post._id} {...post} ref={j === page.length - 1 ? lastPostElementRef : null} />
          ))}
        </React.Fragment>
      ))}
      {isFetchingNextPage && <Loader />}
    </div>
  );
};

export default ForYouPosts;

import { PostType } from '@/types/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { fetchFollowingPosts } from '@/utils/api/fetchFunctions';
import Post from '../Post';
import Loader from '../Loader';

const FollowingPosts = () => {
  const user = useSelector((state: RootState) => state.user);
  const userId = user?._id;

  const cacheKey = 'followingPosts';

  const { data, error, status, isFetchingNextPage, hasNextPage, lastPostElementRef, fetchNextPage } = useInfiniteScroll({
    cacheKey,
    fetchFunction: fetchFollowingPosts,
    additionalParams: { userId }
  });

  if (status === 'loading') return <Loader />;

  if (error) return <div>Error: {error.message}</div>;

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

export default FollowingPosts;

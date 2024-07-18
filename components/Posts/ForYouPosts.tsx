import { PostType } from '@/types/types';
import React, { useEffect, useRef, useCallback } from 'react';
import Loader from '@/components/Loader';
import Post, { fetchAuthorData } from '@/components/Post';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import axios from 'axios';

const fetchForYouPosts = async ({ pageParam = 1 }): Promise<PostType[]> => {
  const response = await axios.get(`/api/posts?page=${pageParam}`);
  return response.data;
};

const prefetchAuthorData = async (queryClient: any, posts: PostType[]) => {
  const uniqueAuthorIds = Array.from(new Set(posts.map(post => post.author_id)));
  uniqueAuthorIds.forEach(author_id => {
    queryClient.prefetchQuery(['postAuthor', author_id], () => fetchAuthorData(author_id));
  });
};

const ForYouPosts: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<PostType[], Error>(
    'forYouPosts',
    ({ pageParam = 1 }) => fetchForYouPosts({ pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return undefined;
        return pages.length + 1;
      },
      onSuccess: (data) => {
        const allPosts = data.pages.flat();
        prefetchAuthorData(queryClient, allPosts);
      },
    }
  );

  const observerElem = useRef<HTMLDivElement | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  if (status === 'loading') return <Loader />;
  if (status === 'error') return <div>Error: {error?.message}</div>;

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

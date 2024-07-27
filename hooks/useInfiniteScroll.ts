import { QueryClient, useInfiniteQuery, useQueryClient } from 'react-query';
import { useCallback, useRef } from 'react';
import { PostType } from '@/types/types';
import { fetchAuthorData } from '@/components/Post';

// Hook to fetch pagination data in any component
// Must use a pagination-responsed api route (like GET /api/posts/following)

/*
  - How to use the hook in a component?
  
  const cacheKey = 'myCacheKey';
  const { data, error, status, isFetchingNextPage, hasNextPage, lastPostElementRef } = useInfiniteScroll({
    cacheKey,                                      // required
    fetchFunction: myFetchFunction,                // required
    additionalParams: { userId, otherParam, ... }  // no required
  });
*/

const prefetchAuthorData = async (queryClient: QueryClient, posts: PostType[]): Promise<void> => {
  const uniqueAuthorIds = Array.from(new Set(posts.map(post => post.author_id)));
  uniqueAuthorIds.forEach(author_id => {
    queryClient.prefetchQuery(['postAuthor', author_id], () => fetchAuthorData(author_id));
  });
};

// The only two required params are 'cacheKey' and 'fetchFunction'
// The other 'additionalParams' params are other params in order to our fetch function requires to fetch data
interface UseInfiniteScrollConfig {
  cacheKey: string;
  fetchFunction: ({ pageParam, ...rest }: { pageParam?: number, [key: string]: any }) => Promise<PostType[]>;
  additionalParams?: { [key: string]: any }; // Parámetros adicionales opcionales
}

const useInfiniteScroll = (
  { cacheKey, fetchFunction, additionalParams = {} }: UseInfiniteScrollConfig
) => {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<PostType[], Error>(
    cacheKey,
    ({ pageParam = 1 }) => fetchFunction({ pageParam, ...additionalParams }),
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

  return { data, error, status, isFetchingNextPage, hasNextPage, lastPostElementRef, fetchNextPage };
};

export default useInfiniteScroll;
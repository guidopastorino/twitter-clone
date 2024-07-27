"use client"

import React, { forwardRef, useEffect, useRef, useState } from 'react'
import DropdownMenu from './DropdownMenu';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Modal from './Modal';
import { useModal } from '@/hooks/useModal';
import { PostType, UserType } from '@/types/types';
import axios from 'axios';
import useToast from '@/hooks/useToast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import Time from './Time';
import HashWords from './HashWords';
import CommentPost from './RouteModals/CommentPost';
import { FaRegHeart, FaHeart, BsFacebook, BsLinkedin, BsRecord, BsTelegram, BsThreeDots, BsTwitter, BsWhatsapp, RiChat3Line, PiShareFat, TbAntennaBars5, GoBookmark, GoBookmarkFill, PiArrowsClockwise } from "@/constants/icons";


export const PostSkeleton = () => (
  <div className='w-full max-w-screen-sm mx-auto p-2 flex justify-center items-start gap-2 outline outline-1 outline-gray-200 dark:outline-neutral-800 duration-100 dark:hover:bg-neutral-900 hover:bg-gray-50 post-skeleton-effect'>
    <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-700 shrink-0'></div>
    <div className='flex flex-col justify-start items-center gap-3 w-full'>
      <div className='w-full h-4 bg-gray-200 dark:bg-neutral-700 rounded'></div>
      <div className='w-full h-20 bg-gray-200 dark:bg-neutral-700 rounded'></div>
    </div>
  </div>
);

export const fetchAuthorData = async (author_id: string): Promise<UserType | undefined> => {
  try {
    const response = await axios.get(`/api/users/${author_id}`)
    if (response.status == 200) {
      return response.data as UserType
    }
  } catch (error) {
    console.error('Error fetching author data:', error);
  }
  return undefined
}

const Post = forwardRef<HTMLDivElement, PostType>(({ _id, author_id, date, description, files, likes, comments, saved, maskedId, createdAt }, ref) => {
  const { data: author, isLoading, error } = useQuery(['postAuthor', author_id], () => fetchAuthorData(author_id), {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = (event.target as HTMLElement)
    const ignoreRedirectsTags = ['BUTTON', 'A', 'SPAN', 'P', 'SVG']

    if (ignoreRedirectsTags.includes(target.tagName)) {
      return;
    }

    router.push(`/i/post/${maskedId}`);
  };

  const { openRouteModal, closeRouteModal } = useModal();

  if (isLoading) return <PostSkeleton />;
  if (error || !author) return <div>Error loading author data</div>;

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className='w-full max-w-screen-sm mx-auto p-2 flex justify-center items-start gap-2 duration-100 hover:bg-gray-50 cursor-pointer rounded-md mb-3 shadow-md bg-white dark:bg-neutral-800 hover:brightness-90'
    >
      <HoverCardDetails trigger={<Link href={`/i/${author.username}`} className='shrink-0'>
        <img src={author.profileImage || "/default_profile_picture.jpg"} className='w-10 h-10 rounded-full object-cover self-start' alt="profile picture" />
      </Link>} author_id={author_id} />

      <div className='flex flex-col justify-start items-center gap-3 w-full'>
        <div className='flex justify-between items-center gap-2 w-full'>
          <p className='flex justify-center items-center gap-1 truncate line-clamp-1'>
            <span className='font-medium text-black'>{author.fullname}</span>
            <span className='dark:text-neutral-500 text-black'>@{author.username}</span>
            <span className='dark:text-neutral-500 text-black'>·</span>
            {date && <span className='dark:text-neutral-500 text-black'><Time timestamp={date} /></span>}
          </p>
          <DropdownMenu button={<button className="w-8 h-8 flex justify-center items-center rounded-full hover:dark:bg-[#031018]"><BsThreeDots /></button>}>{(MenuRef, menu, setMenu) => (
            <>
              {menu && <PostOptions author_id={author_id} />}
            </>
          )}</DropdownMenu>
        </div>
        <p className='w-full text-start break-all whitespace-pre-wrap'><HashWords text={description} /></p>
        <div className='w-full flex justify-between items-center gap-2'>
          <div className="flex justify-center items-center gap-0.5">
            <PostLikeButton />
            <span>{likes.length}</span>
          </div>
          <div className="flex justify-center items-center gap-0.5">
            <PostInteractionButton icon={<RiChat3Line />} onClick={() => openRouteModal(<CommentPost postId={typeof _id != "undefined" ? _id : ""} authorId={author_id} />, "/comment/post")} dataPopup='Comment' />
            <span>{comments.length}</span>
          </div>
          <PostInteractionButton icon={<PiArrowsClockwise />} dataPopup='Repost' />
          <div className='flex gap-1 justify-center items-center'>
            <BookmarkPostAction _id={typeof _id != "undefined" ? _id : ""} author_id={author_id} />
            <Modal
              buttonTrigger={<button className='w-9 h-9 flex justify-center items-center text-md hover:dark:bg-neutral-700 hover:bg-gray-200 duration-100 active:brightness-75 active:scale-95 rounded-full'><PiShareFat /></button>}
              width='90%'
              maxWidth='300px'
            >
              <ShareLinks _id={typeof _id != "undefined" ? _id : ""} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Post

const fetchPostBookmark = async (_id: string, userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      throw new Error("User id is required");
    }

    const response = await axios.get(`/api/posts/${_id}/bookmarks/`, {
      params: { userId }
    });
    const bookmarked = response.data.bookmarked;
    return bookmarked;
  } catch (error) {
    console.error('Error fetching bookmark status:', error);
    return false;
  }
};

const BookmarkPostAction = ({ _id, author_id }: { _id: string, author_id: string }) => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [bookmark, setBookmark] = useState<boolean | null>(null); // Estado inicial como null para evitar el falso estado inicial

  const userId = session?.user.id;

  const { data, isLoading, error } = useQuery(
    ['bookmarkPost', _id, userId],
    () => fetchPostBookmark(_id, userId || ""),
    { enabled: !!userId }
  );

  useEffect(() => {
    if (data !== undefined) {
      setBookmark(data);
    }
    console.log("bookmark:", data);
  }, [data]);

  const mutation = useMutation(
    async (newBookmarkStatus: boolean) => {
      if (userId) {
        await axios.post(`/api/posts/${_id}/bookmarks`, { bookmark: newBookmarkStatus, userId: userId });
      }
    },
    {
      onMutate: async (newBookmarkStatus: boolean) => {
        await queryClient.cancelQueries(['bookmarkPost', _id, userId]);

        const previousBookmarkStatus = queryClient.getQueryData<boolean>(['bookmarkPost', _id, userId]);

        queryClient.setQueryData(['bookmarkPost', _id, userId], newBookmarkStatus);

        setBookmark(newBookmarkStatus);

        return { previousBookmarkStatus };
      },
      onError: (err, newBookmarkStatus, context) => {
        queryClient.setQueryData(['bookmarkPost', _id, userId], context?.previousBookmarkStatus ?? false);
        setBookmark(context?.previousBookmarkStatus ?? false);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['bookmarkPost', _id, userId]);
      },
    }
  );

  const { showToast } = useToast()

  const handleBookmarkClick = () => {
    if (bookmark !== null) {
      const newBookmarkStatus = !bookmark;
      mutation.mutate(newBookmarkStatus);
      showToast(newBookmarkStatus ? "Post added to your bookmarks" : "Post removed from your bookmarks");
    }
  };

  if (bookmark === null && isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PostInteractionButton
      onClick={handleBookmarkClick}
      dataPopup={bookmark ? "Remove Bookmark" : "Bookmark"}
      icon={bookmark ? <GoBookmarkFill /> : <GoBookmark />}
    />
  );
};


const PostOptions = ({ author_id }: { author_id: string }) => {
  const { data: session, status } = useSession()

  if (status == "loading") return <Loader />

  // obtener datos del autor
  const { data, isLoading, error } = useQuery<UserType | undefined, Error>(
    ['userCardData', author_id],
    () => fetchAuthorData(author_id),
    { enabled: status === "authenticated" }
  )

  if (isLoading) return <Loader />

  if (!data) return "User not found"

  // other user's post
  const otherPostOptions = [
    "Not interested in this post",
    `Unfollow @${data.username}`,
    `Subscribe to @${data.username}`,
    `Add/remove @${data.username} from Lists`,
    `Mute @${data.username}`,
    `Block @${data.username}`,
    "View post engagements",
    "Embed post",
    "Report post",
  ]


  // creator of the post
  const yourPostOptions = [
    "Delete",
    "Edit",
    "Pin to your profile",
    "Highlight on your profile",
    "Add/remove @PastorinoGuido from Lists",
    "Mute this conversation",
    "Change who can reply",
    "View post engagements",
    "Embed post",
    "View post analytics",
    "View hidden replies",
  ]

  return (
    <div className='py-1 w-max overflow-hidden rounded-lg dark:bg-neutral-800 bg-white shadow-lg text-sm h-max max-h-[60vh] overflow-y-auto'>
      {
        (session?.user.id == author_id)
          ? <div>{yourPostOptions.map((el, i) => (<div className='p-2 hover:bg-neutral-700 active:brightness-90 duration-75 cursor-pointer'>{el}</div>))}</div>
          : <div>{otherPostOptions.map((el, i) => (<div className='p-2 hover:bg-neutral-700 active:brightness-90 duration-75 cursor-pointer'>{el}</div>))}</div>
      }
      {error && error.message}
    </div>
  )
}

const PostLikeButton = () => {
  // liked: <FaHeart />, noliked: <FaRegHeart />
  return (
    <PostInteractionButton icon={<FaRegHeart />} dataPopup='Like' />
  )
}

type ShareLinkObj = {
  social: string;
  icon: React.ReactNode;
  link: string;
}

// _id: post id
const ShareLinks = ({ _id }: { _id: string }) => {
  const link = `http://localhost:3000/i/post/${_id}`;

  const shareLinksArray: ShareLinkObj[] = [
    {
      social: "Facebook",
      icon: <BsFacebook />,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
    },
    {
      social: "Twitter",
      icon: <BsTwitter />,
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}&text=Check%20this%20out!`
    },
    {
      social: "LinkedIn",
      icon: <BsLinkedin />,
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`
    },
    {
      social: "Whatsapp",
      icon: <BsWhatsapp />,
      link: `https://api.whatsapp.com/send?text=${encodeURIComponent(link)}`
    },
    {
      social: "Telegram",
      icon: <BsTelegram />,
      link: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=Check%20this%20out!`
    }
  ]

  return (
    <div className='w-full'>
      <div className='w-full p-3'>
        <span className="font-medium text-center block text-xl">
          Share this post
        </span>
      </div>
      {shareLinksArray.map((el, i) => (
        <Link target='_blank' href={el.link} className='flex justify-start items-center gap-3 hover:bg-gray-200 dark:hover:bg-neutral-900 cursor-pointer py-2 px-4 w-full' key={i}>
          <span className='shrink-0'>{el.icon}</span>
          <span>Share with {el.social}</span>
        </Link>
      ))}
    </div>
  )
}

// add some actions via props...
const PostInteractionButton = ({ icon, dataPopup, onClick }: { icon: React.ReactNode, dataPopup: string, onClick?: () => void }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (onClick) {
      onClick();
    }
  }

  return (
    <button data-popup={dataPopup} onClick={handleClick} className='w-9 h-9 flex justify-center items-center text-md hover:dark:bg-neutral-700 hover:bg-gray-200 duration-100 active:brightness-75 active:scale-95 rounded-full'>
      {icon}
    </button>
  )
}

interface HoverCardDetailsProps {
  trigger: React.ReactElement;
  author_id: string;
}
// when trigger is hovered (mouseover..) wait 1 sec and show the card
// trigger is any html element
const HoverCardDetails: React.FC<HoverCardDetailsProps> = ({ trigger, author_id }) => {
  const [showCard, setShowCard] = useState(false);
  const CardRef = useRef<HTMLDivElement>(null);
  const TriggerRef = useRef<HTMLDivElement>(null);
  const TimeoutRef = useRef<number | null>(null);

  const { data, isLoading, error } = useQuery<UserType | undefined, Error>(
    ['userCardData', author_id],
    () => fetchAuthorData(author_id),
    { enabled: showCard }
  )

  const handleMouseOver = () => {
    TimeoutRef.current = window.setTimeout(() => {
      setShowCard(true);
    }, 1000);
  };

  const handleMouseOut = () => {
    if (TimeoutRef.current) {
      clearTimeout(TimeoutRef.current);
    }
    setShowCard(false);
  };

  useEffect(() => {
    const cardElement = TriggerRef.current;
    if (cardElement) {
      cardElement.addEventListener('mouseover', handleMouseOver);
      cardElement.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (cardElement) {
        cardElement.removeEventListener('mouseover', handleMouseOver);
        cardElement.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, []);

  return (
    <div className='shrink-0 relative'>
      {React.cloneElement(trigger, { ref: TriggerRef })}
      {showCard && (
        <div ref={CardRef} className="w-72 absolute top-full left-1/2 transform -translate-x-1/2 bg-black p-3 rounded-lg shadow-equal shadow-gray-600">
          {isLoading && <Loader />}
          {!isLoading && (
            <>
              {error && <div>{error.message}</div>}
              {data ? (
                <div>
                  <p>{data.fullname}</p>
                  <p>Posts: {data.posts.length}</p>
                </div>
              ) : (
                <div>User not found</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const PostFiles = () => {

}
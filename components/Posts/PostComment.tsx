"use client"

import { CommentsActivity, UserType } from "@/types/types";
import { fetchUser, fetchUsers } from "@/utils/api/fetchFunctions";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PostSkeleton } from "../Post";
import Link from "next/link";
import Time from "../Time";

interface PostCommentsProps extends CommentsActivity {
  postAuthor?: string;
}

const PostComment: React.FC<PostCommentsProps> = ({
  postReplyingId,
  author_id,
  comment,
  replyingTo,
  files,
  gif,
  type,
  likes,
  comments,
  date,
  postAuthor
}) => {
  const [isPostAuthor, setIsPostAuthor] = useState<boolean>(false)

  const { data: commentAuthor, isLoading: isLoadingCommentAuthor, error: commentAuthorError } = useQuery<UserType, Error>(
    ['postCommentAuthor', author_id],
    () => fetchUser(author_id),
    { enabled: !!author_id }
  )

  const { data: replyingToUsersData, isLoading: isLoadingReplyingTo, error: replyingToError } = useQuery<string[], Error>(
    ['replyingToUsersData', replyingTo],
    () => fetchUsers(replyingTo),
    { enabled: !!replyingTo }
  )

  useEffect(() => {
    if (commentAuthor && replyingToUsersData) {
      setIsPostAuthor(commentAuthor.username == postAuthor)
    }
  }, [commentAuthor, replyingToUsersData])

  if (isLoadingCommentAuthor && isLoadingReplyingTo) return <PostSkeleton />

  if (!commentAuthor) return;

  return (
    <div
      className='w-full max-w-screen-sm mx-auto p-2 flex justify-center items-start gap-2 outline outline-1 outline-gray-200 dark:outline-neutral-800 duration-100 dark:hover:bg-neutral-900 hover:bg-gray-50 cursor-pointer'
    >
      <Link href={`/i/${commentAuthor.username}`} className='shrink-0'>
        <img src={commentAuthor.profileImage || "/default_profile_picture.jpg"} className='w-10 h-10 rounded-full object-cover self-start' alt="profile picture" />
      </Link>
      <div className='flex flex-col justify-start items-center gap-3 w-full'>
        <div className='flex flex-col justify-start items-center gap-1 w-full'>
          <div className='flex justify-between items-center gap-2 w-full'>
            <p className='flex justify-center items-center gap-1 truncate line-clamp-1'>
              <span className='font-medium'>{commentAuthor.fullname}</span>
              <span className='dark:text-neutral-500 text-neutral-400'>@{commentAuthor.username}</span>
              <span className='dark:text-neutral-500 text-neutral-400'>·</span>
              {date && <span className='dark:text-neutral-500 text-neutral-400'><Time timestamp={date} /></span>}
              {/* set author badge */}
              {postAuthor && isPostAuthor && <>
                <span className='dark:text-neutral-500 text-neutral-400'>·</span>
                <span className='text-red-500'>Author</span>
              </>}
            </p>
            {/* options button */}
          </div>

          {/* replying to */}
          {!isPostAuthor && !!replyingToUsersData && <div className='flex justify-start items-center gap-2 w-full'>
            <span className='text-neutral-300'>Replying to</span>
            {replyingToUsersData.map((el, i) => <Link key={i} href={`/i/${el}`} className='text-blue-600 font-medium hover:underline'>@{el}</Link>)}
          </div>}
        </div>

        <p className='w-full text-start break-all whitespace-pre-wrap'>{comment}</p>
      </div>
    </div>
  );
};

export default PostComment;
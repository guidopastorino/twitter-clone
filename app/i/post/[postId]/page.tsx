"use client"

import DropdownMenu from '@/components/DropdownMenu'
import Loader from '@/components/Loader'
import { PostSkeleton } from '@/components/Post'
import Time from '@/components/Time'
import { CommentsActivity, PostType, UserType, WhoCanReplyPost } from '@/types/types'
import { fetchPostComments, fetchPostData, fetchUser, fetchUsers } from '@/utils/api/fetchFunctions'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
// 
import { BsEmojiSmile, BsThreeDots } from 'react-icons/bs'
import { CgArrowLeft } from 'react-icons/cg'
import { BsFilterRight } from "react-icons/bs";
import { RiChatOffLine } from "react-icons/ri";
import { useRouter, useSearchParams } from 'next/navigation'
import { IoIosLock } from "react-icons/io";
import HashWords from '@/components/HashWords'
import useMakeComment from '@/hooks/useMakeComment'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { MdOutlineCalendarMonth, MdOutlineGifBox, MdOutlineLocationOn, MdOutlinePhoto, MdOutlinePoll } from 'react-icons/md'

const Page = ({ params }: { params: { postId: string } }) => {
  // state that indicates if user can comment a post or not (depending on whoCanReply)
  const [canComment, setCanComment] = useState<boolean>(false);

  useEffect(() => console.log("Can comment: ", canComment), [canComment])

  const user = useSelector((state: RootState) => state.user)

  const router = useRouter();
  const searchParams = useSearchParams();
  const sortComments = searchParams.get('sort_comments');

  const handleSortComments = (e: React.MouseEvent<HTMLDivElement>) => {
    const sortValue = (e.target as HTMLElement).textContent;
    if (sortValue) {
      router.push(`?sort_comments=${sortValue}`);
    }
  };

  const { data: post, isLoading: isLoadingPostData, error: postDataError } = useQuery<PostType, Error>(
    ['postData', params.postId],
    () => fetchPostData(params.postId),
    { enabled: !!params.postId }
  );

  const { data: author, isLoading: isLoadingAuthor, error: authorError } = useQuery<UserType, Error>(
    ['postAuthor', post?.author_id],
    () => fetchUser(post?.author_id || ""),
    { enabled: !!post?.author_id }
  );

  useEffect(() => console.log("Post author: ", author), [author]);

  const { data: comments, isLoading: isLoadingComments, error: commentsError } = useQuery<CommentsActivity[], Error>(
    ['postComments', params.postId],
    () => fetchPostComments(params.postId),
    { enabled: !!params.postId }
  );

  useEffect(() => {
    if (!post || !author || !user) return;

    const whoCanReply = post.whoCanReply as WhoCanReplyPost;

    // si todos pueden responder o si el usuario actualmente logeado es el mismo que el autor del post, entonces true
    if (whoCanReply === 'Everyone' || user.username == author.username) {
      setCanComment(true);
    } else if (whoCanReply === 'Accounts you follow') {
      setCanComment(author.following.includes(user._id));
    } else if (whoCanReply === 'Verified accounts') {
      setCanComment(user.privacy.isVerified);
    } else if (whoCanReply === 'Only accounts you mention') {
      const mentionedUsernames = post.description.match(/@\w+/g)?.map(mention => mention.slice(1)) || [];
      setCanComment(mentionedUsernames.includes(user.username));
    }
  }, [post, author, user]);

  // comment box functions

  const {
    currentUser, // username del usuario actualmente logeado
    currentTheme,
    replyingTo,
    addReplyingTo,
    draft,
    text,
    setText,
    setPostReplyingId,
    replyType,
    setReplyType, // pasarlo por prop (desde Post.tsx)
    handleEmojiClick,
    handleChange,
    handleCommentSubmit,
  } = useMakeComment()

  // al cargar el componente, establecer los estados correspondientes
  useEffect(() => {
    if (post && author) {
      setPostReplyingId(post._id);
      addReplyingTo(author._id)
    }
  }, [post, author, user])

  // --------------------------

  if (isLoadingPostData || isLoadingAuthor || isLoadingComments) return <div className="w-full h-full flex justify-center items-center"><Loader /></div>;

  if (postDataError || authorError || commentsError) return <div>{postDataError?.message}</div>;

  if (!post) return <div>Post not found</div>;

  const sortedComments = () => {
    if (!comments) return [];

    if (sortComments === 'Most liked') {
      return [...comments].sort((a: CommentsActivity, b: CommentsActivity) => b.likes.length - a.likes.length);
    }

    if (sortComments === 'Recent') {
      return [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return comments;
  };

  return (
    <>
      <div className="flex justify-start items-center gap-3 w-full sticky top-0 z-40 backdrop-blur-sm bg-black/60 p-2">
        <button onClick={() => window.history.back()} className='dark:hover:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg'><CgArrowLeft /></button>
        <span className="font-medium text-lg">Post</span>
      </div>
      <div className='flex justify-between items-center gap-2 w-full p-2'>
        <div className="flex justify-center items-start gap-2">
          <Link href={`/i/${author?.username}`} className='shrink-0'>
            <img src={author?.profileImage || "/default_profile_picture.jpg"} className='w-10 h-10 rounded-full object-cover self-start' alt="profile picture" />
          </Link>
          <p className='flex justify-center items-center gap-1 truncate line-clamp-1'>
            <span className='font-medium'>{author?.fullname}</span>
            {author?.privacy.privateAccount && <IoIosLock className='text-lg' />}
            <span className='dark:text-neutral-500 text-neutral-400'>·</span>
            <span className='dark:text-neutral-500 text-neutral-400'>{author?.username}</span>
            <span className='dark:text-neutral-500 text-neutral-400'>·</span>
            {post.date && <span className='dark:text-neutral-500 text-neutral-400'><Time timestamp={post.date} /></span>}
          </p>
        </div>
        <button><BsThreeDots /></button>
      </div>
      <div className="p-3">
        <HashWords text={post.description} />
      </div>
      {post.files.length > 0 && <div>files....</div>}
      <span>Bookmarks: {post?.bookmarks?.length}</span>
      <div></div>
      <hr />
      <span className="flex justify-between items-center gap-3 p-3 dark:bg-dark outline outline-1 outline-gray-200 dark:outline-neutral-800">
        <span className='font-bold text-xl'>Comments</span>
        <DropdownMenu button={<button data-options="Sort comments" className='cursor-pointer dark:hover:bg-neutral-900 hover:bg-gray-50 w-10 h-10 rounded-full flex justify-center items-center text-lg'><BsFilterRight /></button>}>
          {(MenuRef, menu, setMenu) => (
            <>
              {menu && <div ref={MenuRef} className='py-1 w-40 max-w-max bg-neutral-800 rounded-lg overflow-hidden whitespace-nowrap'>
                <div onClick={(e) => { handleSortComments(e); setMenu(!menu); }} className='w-full px-3 py-2 bg-neutral-800 active:brightness-95 cursor-pointer hover:bg-neutral-700'>Most liked</div>
                <div onClick={(e) => { handleSortComments(e); setMenu(!menu); }} className='w-full px-3 py-2 bg-neutral-800 active:brightness-95 cursor-pointer hover:bg-neutral-700'>Recent</div>
              </div>}
            </>
          )}
        </DropdownMenu>
      </span>
      {((post?.whoCanReply as WhoCanReplyPost) !== 'Everyone') && <div className='flex flex-col gap-2 justify-start items-start p-3 bg-teal-950 rounded-lg text-white'>
        <span className='font-medium text-xl'>Who can reply?</span>
        <span className='flex justify-start items-center gap-1'>
          {((post?.whoCanReply as WhoCanReplyPost) === 'Accounts you follow')
            ? <div>Accounts @{author?.username} follow</div>
            : ((post?.whoCanReply as WhoCanReplyPost) === 'Only accounts you mention')
              ? <div>Accounts @{author?.username} mention</div>
              : ((post?.whoCanReply as WhoCanReplyPost) === 'Verified accounts')
                ? <div>Verified accounts</div>
                : ""
          }
          <div>can reply this post</div>
        </span>
      </div>}
      <div className='flex flex-col justify-start items-start'>
        {/* ========= render comment box (useMakeComment) =========*/}
        {canComment ? <div className='p-2 w-full block outline outline-1 outline-gray-200 dark:outline-neutral-800'>
          <div className='w-full flex justify-center items-start gap-2'>
            <img className='w-10 h-10 rounded-full object-cover' src={user?.profileImage || "/default_profile_picture.jpg"} alt="picture image" />
            <div className='w-full flex flex-col justify-start items-center'>
              <div className='w-full flex justify-start items-center gap-1'>
                <span>{user?.fullname}</span>
                <span className='dark:text-neutral-500'>@{user?.username}</span>
              </div>
              {/* comment box */}
              <textarea className='p-3 w-full outline-none bg-transparent' value={text} onChange={(e) => handleChange(e)} placeholder='Add a comment'></textarea>
              <div className='flex justify-between items-center gap-2 py-3 border-t border-t-neutral-800 w-full'>
                <div className='flex justify-start items-center gap-0.5'>
                  <button className="w-[34.4px] h-[34.4px] text-[20px] flex justify-center items-center rounded-full dark:text-[#1d9bf0] hover:dark:bg-[#031018] duration-100"><MdOutlinePhoto /></button>
                  <button className="w-[34.4px] h-[34.4px] text-[20px] flex justify-center items-center rounded-full dark:text-[#1d9bf0] hover:dark:bg-[#031018] duration-100"><MdOutlineGifBox /></button>
                  <button className="w-[34.4px] h-[34.4px] text-[20px] flex justify-center items-center rounded-full dark:text-[#1d9bf0] hover:dark:bg-[#031018] duration-100"><MdOutlinePoll /></button>
                  <DropdownMenu button={<button className="w-[34.4px] h-[34.4px] text-[20px] flex justify-center items-center rounded-full dark:text-[#1d9bf0] hover:dark:bg-[#031018] duration-100"><BsEmojiSmile /></button>}>{(MenuRef, menu, setMenu) => (
                    <>
                      {menu && <div ref={MenuRef} className='shadow-lg'>
                        <EmojiPicker theme={currentTheme == "light" ? Theme.LIGHT : Theme.DARK} width={270} height={350} onEmojiClick={handleEmojiClick} />
                      </div>}
                    </>
                  )}</DropdownMenu>
                  <button className="w-[34.4px] h-[34.4px] text-[20px] flex justify-center items-center rounded-full dark:text-[#1d9bf0] hover:dark:bg-[#031018] duration-100"><MdOutlineCalendarMonth /></button>
                  <button className="w-[34.4px] h-[34.4px] text-[20px] flex justify-center items-center rounded-full dark:text-[#1d9bf0] hover:dark:bg-[#031018] duration-100"><MdOutlineLocationOn /></button>
                </div>

                {/* send post button */}
                <button disabled={!text} className={`${!text && "pointer-events-none brightness-50"} px-5 py-1.5 text-white hover:brightness-95 duration-100 bg-[#1d9bf0] rounded-full font-medium select-none`} onClick={handleCommentSubmit}>Comment</button>
              </div>
            </div>

          </div>
        </div> : <div className='text-red-500 p-4'>You cannot comment on this post.</div>}
        {/* =======================================================*/}

        {comments?.length === 0 && <div className='flex flex-col gap-3 justify-center items-center w-full h-full px-3 py-7'>
          <RiChatOffLine className='dark:text-neutral-600 text-5xl lg:text-7xl' />
          <div className='px-5 py-3 text-center dark:text-neutral-600 text-slate-500'>No comments to show</div>
        </div>}

        {sortedComments().map((comment, i) => (
          <PostComment key={i} {...comment} postAuthor={author?.username || ""} />
        ))}
      </div>
    </>
  );
}

export default Page;

// -----------------

interface PostCommentsProps extends CommentsActivity {
  postAuthor?: string;
}

export const PostComment: React.FC<PostCommentsProps> = ({
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
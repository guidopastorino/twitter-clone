"use client";

import { PostType, UserType } from '@/types/types';
import { fetchPostData, fetchUser } from '@/utils/api/fetchFunctions'; // Importa las funciones de fetch
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import Loader from '../Loader';
import { MdOutlineCalendarMonth, MdOutlineGifBox, MdOutlineLocationOn, MdOutlinePhoto, MdOutlinePoll } from 'react-icons/md';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import DropdownMenu from '../DropdownMenu';
import { BsEmojiSmile } from 'react-icons/bs';
import useMakeComment from '@/hooks/useMakeComment';

type Props = {
  postId: string;
  authorId: string;
};

// hacer fetch del post (postId), del autor del post (authorId) y del usuario que va a comentar el post (session?.user.id)
const CommentPost = ({ postId, authorId }: Props) => {
  const { data: session } = useSession();

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
    if(postId && authorId){
      setPostReplyingId(postId);
      addReplyingTo(authorId)
    }
  }, [postId, authorId])

  // fetch post data
  const { data: postToReply, isLoading: postLoading, error: postError } = useQuery<PostType, Error>(
    ['postData', postId],
    () => fetchPostData(postId),
    { enabled: !!postId }
  );

  // fetch post author data
  const { data: postAuthor, isLoading: authorLoading, error: authorError } = useQuery<UserType, Error>(
    ['postAuthor', authorId],
    () => fetchUser(authorId),
    { enabled: !!authorId }
  );

  // fetch user replying data
  const { data: userReplying, isLoading: userLoading, error: userError } = useQuery<UserType, Error>(
    ['userData', session?.user.id],
    () => fetchUser(session?.user.id || ""),
    { enabled: !!session?.user.id }
  );

  if (!postId || !authorId || !session?.user.id) {
    return <div>Error</div>;
  }

  if (postLoading || authorLoading || userLoading) {
    return <div className="p-3 w-full flex justify-center items-center"><Loader /></div>;
  }

  if (postError || authorError || userError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className='p-2'>
      <div className='w-full flex justify-center items-start gap-2 h-28 mb-3'>
        <div className='shrink-0 flex flex-col gap-2 justify-start items-center h-full'>
          <img className='w-10 h-10 rounded-full object-cover' src={postAuthor?.profileImage || "/default_profile_picture.jpg"} alt="picture image" />
          <div className='w-[2px] h-full rounded-full bg-neutral-700'></div>
        </div>
        <div className='w-full flex flex-col justify-start items-center'>
          <div className='w-full flex justify-start items-center gap-1'>
            <span>{postAuthor?.fullname}</span>
            <span className='dark:text-neutral-500'>@{postAuthor?.username}</span>
            <span className='dark:text-neutral-500'>{postToReply?.createdAt}</span>
          </div>
          <div className='brak-all w-full text-start'>{postToReply?.description}</div>
        </div>
      </div>
      {/*  */}
      <div className='w-full flex justify-center items-start gap-2'>
        <img className='w-10 h-10 rounded-full object-cover' src={userReplying?.profileImage || "/default_profile_picture.jpg"} alt="picture image" />
        <div className='w-full flex flex-col justify-start items-center'>
          <div className='w-full flex justify-start items-center gap-1'>
            <span>{userReplying?.fullname}</span>
            <span className='dark:text-neutral-500'>@{userReplying?.username}</span>
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
    </div>
  );
};

export default CommentPost;

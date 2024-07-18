import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import Link from 'next/link';
import React from 'react';
import DropdownMenu from '../DropdownMenu';
import { PostType, WhoCanReplyPost } from '@/types/types';
import useComposePost from '@/hooks/useComposePost';
// bottom icons
import { MdOutlinePhoto } from "react-icons/md";
import { MdOutlineGifBox } from "react-icons/md";
import { MdOutlinePoll } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
// who can reply icons
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlineVerified } from "react-icons/md";
import { LuAtSign } from "react-icons/lu";
import { MdOutlineCheck } from "react-icons/md";

/*
  Button
  color: #1d9bf0
  bg color: #031018
  class: "w-[34.4px] h-[34.4px] text-[25px] flex justify-center items-center rounded-full dark:text-[#1d9bf0] dark:bg-[#031018]"
*/

const ComposePost = () => {
  const {
    currentUser,
    currentTheme,
    text,
    draft,
    userMentioned,
    replyOption,
    handleChange,
    handleEmojiClick,
    handleReplyOptionChange,
    handlePostSubmit
  } = useComposePost()

  return (
    <div className='px-3 flex flex-col gap-3'>
      <div className='w-full flex justify-center items-center gap-2'>
        <Link href={`/i/${currentUser}`} className='shrink-0'>
          <img src='/default_profile_picture.jpg' alt='profile picture' className='w-10 h-10 rounded-full object-cover' />
        </Link>
        <textarea
          className='w-full p-2 outline-none border-none bg-transparent'
          placeholder='What is happening?!'
          value={text}
          onChange={handleChange}
        />
      </div>
      {userMentioned && <div><Link href={`/i/${userMentioned}`}>@{userMentioned}</Link></div>}

      <div>
        <DropdownMenu button={<button className='px-3 py-0.5 text-[20px] flex justify-center items-center gap-1 rounded-full dark:text-[#1d9bf0] hover:dark:bg-[#031018] duration-100'><span className='font-bold text-sm'>{replyOption} can reply</span><MdKeyboardArrowDown className='text-2xl' /></button>}>{(MenuRef, menu, setMenu) => (
          // menu
          <div ref={MenuRef} className={`${menu ? "opacity-1 pointer-events-auto" : "opacity-0 pointer-events-none hidden"} dark:bg-black bg-white shadow-equal shadow-gray-600 rounded-xl w-80 select-none overflow-hidden duration-150`}>
            <div className='text-start p-3'>
              <p className="font-bold pb-2 text-lg">Who can reply?</p>
              <p className='text-slate-500'>Choose who can reply to this post. Anyone mentioned can always reply.</p>
            </div>
            <div>
              {Array.from([{ icon: <BiWorld />, option: "Everyone" }, { icon: <MdOutlinePerson />, option: "Accounts you follow" }, { icon: <MdOutlineVerified />, option: "Verified accounts" }, { icon: <LuAtSign />, option: "Only accounts you mention" }]).map((el, i) => (
                <div onClick={() => { handleReplyOptionChange(el.option as WhoCanReplyPost); setMenu(!menu); }} className="flex justify-between items-center gap-3 p-3 hover:bg-neutral-800 active:brightness-75 duration-100 cursor-pointer">
                  <div className="flex justify-center items-center gap-2">
                    <div className='w-9 h-9 flex justify-center items-center text-white text-lg rounded-full bg-[#1d9bf0]'>
                      {el.icon}
                    </div>
                    <span className='font-medium'>{el.option}</span>
                  </div>
                  {replyOption == el.option && <MdOutlineCheck className='text-[#1d9bf0] text-xl' />}
                </div>
              ))}
            </div>
          </div>
        )}</DropdownMenu>
      </div>

      <div className='flex justify-between items-center gap-2 py-3 border-t border-t-neutral-800'>
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
        <button disabled={!text} className={`${!text && "pointer-events-none brightness-50"} px-5 py-1.5 text-white hover:brightness-95 duration-100 bg-[#1d9bf0] rounded-full font-medium select-none`} onClick={handlePostSubmit}>Post</button>
      </div>
    </div>
  );
}

export default ComposePost;
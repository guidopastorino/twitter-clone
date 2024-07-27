"use client"

import React from 'react'
import { BsGear } from '@/constants/icons'
import { useModal } from '@/hooks/useModal'
import FeedOptions from '@/components/RouteModals/FeedOptions'
import useActiveTab from '@/hooks/useActiveTab'
import ForYouPosts from './Posts/ForYouPosts'
import FollowingPosts from './Posts/FollowingPosts'

const FeedNavbar = () => {
  const { openRouteModal } = useModal();
  const { activeTab, updateActiveTab } = useActiveTab(0)

  return (
    <>
      <header className='w-full bg-white/60 dark:bg-black/60 backdrop-blur-sm sticky z-30 top-0 grid grid-cols-[_1fr_1fr_50px_] select-none h-12'>
        <div onClick={() => updateActiveTab(0)} className={`p-3 cursor-pointer hover:bg-neutral-800/30 active:bg-neutral-800/60 duration-75 flex justify-center items-center ${activeTab === 0 && "bg-neutral-800/30"}`}>For you</div>
        <div onClick={() => updateActiveTab(1)} className={`p-3 cursor-pointer hover:bg-neutral-800/30 active:bg-neutral-800/60 duration-75 flex justify-center items-center ${activeTab === 1 && "bg-neutral-800/30"}`}>Following</div>
        <div onClick={() => openRouteModal(<FeedOptions />, "/feed-options")} className='p-3 cursor-pointer hover:bg-neutral-800/30 active:bg-neutral-800/60 duration-75 flex justify-center items-center'><BsGear /></div>
      </header>

      {activeTab === 0 && <ForYouPosts />}
      {activeTab === 1 && <FollowingPosts />}
    </>
  )
}

export default FeedNavbar
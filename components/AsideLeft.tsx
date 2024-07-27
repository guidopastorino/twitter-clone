"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import LogoSVG from './LogoSVG';
import useUser from '@/hooks/useUser';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useModal } from '@/hooks/useModal';
import ComposePost from '@/components/RouteModals/ComposePost';
// icons
import { BiSolidHomeCircle, BiHomeCircle } from "react-icons/bi";
import { MdEmail, MdOutlineEmail, MdOutlinePeopleAlt, MdOutlinePeople, MdOutlinePersonOutline, MdPerson } from "react-icons/md";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { BsFillBellFill, BsBell } from "react-icons/bs";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";

type LinkAsideLeft = {
  name: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  path: string;
}

const AsideLeft = () => {
  useUser();

  const user = useSelector((state: RootState) => state.user)
  
  const pathname = usePathname()
  
  const links: LinkAsideLeft[] = [
    {
      name: "Home",
      icon: <BiHomeCircle />,
      activeIcon: <BiSolidHomeCircle />,
      path: "/i"
    },
    {
      name: "Explore",
      icon: <IoSearchOutline />,
      activeIcon: <IoSearch />,
      path: "/i/explore"
    },
    {
      name: "Notifications",
      icon: <BsBell />,
      activeIcon: <BsFillBellFill />,
      path: "/i/notifications"
    },
    {
      name: "Messages",
      icon: <MdOutlineEmail />,
      activeIcon: <MdEmail />,
      path: "/i/inbox"
    },
    {
      name: "Bookmarks",
      icon: <GoBookmark />,
      activeIcon: <GoBookmarkFill />,
      path: "/i/bookmarks"
    },
    {
      name: "Communities",
      icon: <MdOutlinePeopleAlt />,
      activeIcon: <MdOutlinePeople />,
      path: "/i/communities"
    },
    {
      name: "Profile",
      icon: <MdOutlinePersonOutline />,
      activeIcon: <MdPerson />,
      path: `/i/${user.username}`
    }
  ]

  const { openRouteModal } = useModal();

  return (
    <aside className='overflow-y-auto overflow-x-hidden sticky top-0 h-dvh py-2 lg:flex px-2'>
      <div className='w-full h-full flex flex-col justify-between items-center'>
        <div className='w-full flex flex-col justify-center items-center'>
          <div className='shrink-0 w-full flex justify-center lg:justify-start items-center py-3'>
            <Link href={"/i"} className='shrink-0 active:scale-95 duration-100 w-13 h-13 flex justify-center items-center rounded-full dark:hover:bg-neutral-900 hover:bg-gray-50 p-3'>
              <LogoSVG />
            </Link>
          </div>
          <ul className='w-full flex justify-center items-center lg:items-start flex-col gap-2 lg:gap-0'>
            {links.map((el, i) => {
              const isActive = pathname === el.path || (el.path === "/i/explore" && pathname.startsWith("/i/search")); // the second part is for the search results page

              return (
                <li key={i} className='list-none active:scale-95 duration-100'>
                  <Link href={el.path} className={`${isActive && "dark:bg-neutral-900 bg-gray-50"} w-12 h-12 lg:w-full p-3 gap-3 flex justify-center lg:justify-start items-center dark:hover:bg-neutral-900 hover:bg-gray-50 cursor-pointer rounded-full`}>
                    <div className='w-7 h-7 shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain'>
                      {el.activeIcon ? <>{isActive ? el.activeIcon : el.icon}</> : <>{el.icon}</>}
                    </div>
                    <span className='text-lg hidden lg:flex'>{el.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <button
          onClick={() => openRouteModal(<ComposePost />, "/compose/post")}
          className='p-3 w-full font-bold bg-white text-neutral-900 rounded-full text-xl text-center active:scale-95 duration-100'
        >
          Post
        </button>
      </div>
    </aside>
  )
}

export default AsideLeft
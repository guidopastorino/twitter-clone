import { signOut } from 'next-auth/react'
import React from 'react'
import ThemeButton from '../ThemeButton'

const FeedOptions = () => {
  return (
    <div>
      Feed options
      <li onClick={() => {
        if (typeof window != "undefined") {
          window.localStorage.clear()
          signOut()
        }
      }} className='list-none p-2 flex justify-start items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-900 cursor-pointer py-2 px-4'>
        <span>Sign out</span>
      </li>
      <ThemeButton />
    </div>
  )
}

export default FeedOptions
"use client"

import React, { useEffect, useRef, useState } from 'react'
import { IoSearchOutline } from '@/constants/icons'

const SearchBar = () => {
  const SearchContainerRef = useRef<HTMLDivElement | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    let handler = (e: MouseEvent) => {
      if (SearchContainerRef.current) {
        if (e.target == SearchContainerRef.current || (e.target as HTMLElement).tagName == 'INPUT') return;
        if (!SearchContainerRef.current.contains(e.target as Node)) {
          setIsSearching(false)
        }
      }
    }

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  })

  // 
  const [results, setResults] = useState<Array<any>>([]);
  const [query, setQuery] = useState<string>("");

  return (
    <div className='w-full sticky top-0 bg-black'>
      <form action={"/i/search"} className='w-full h-12 p-0.5 rounded-full overflow-hidden flex justify-center items-center bg-neutral-900'>
        <div className='h-full w-10 flex justify-center items-center text-xl text-white shrink-0'>
          <IoSearchOutline />
        </div>
        <input
          onFocus={() => setIsSearching(true)}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search people, hashtags, posts...'
          className='flex-1 w-full h-full p-2 rounded-r-full backdrop-blur-sm bg-transparent outline-none'
          type="search"
          name='q'
        />
      </form>

      {isSearching && <div ref={SearchContainerRef} className='w-full absolute top-14 left-0 p-3 text-white bg-black rounded-lg shadow-2xl'>
        <span className='font-medium inline-block pb-3'>Search results</span>
      </div>}
    </div>
  )
}

export default SearchBar

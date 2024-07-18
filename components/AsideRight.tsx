import React from 'react'
import SearchBar from './SearchBar'

const AsideRight = () => {
  return (
    <aside className='overflow-y-auto overflow-x-hidden sticky top-0 h-dvh hidden xl:flex px-3 flex-col gap-3 justify-start items-start'>
      <SearchBar />
    </aside>
  )
}

export default AsideRight
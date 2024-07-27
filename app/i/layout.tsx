import AsideLeft from '@/components/AsideLeft'
import AsideRight from '@/components/AsideRight'
import React from 'react'

const page = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='mx-auto w-full max-w-screen-xl grid grid-cols-[_80px_1fr_] lg:grid-cols-[_300px_1fr_] xl:grid-cols-[_300px_1fr_400px_]'>
        <AsideLeft />
        <div className='w-full'>
          {children}
        </div>
        <AsideRight />
      </div>
    </>
  )
}

export default page
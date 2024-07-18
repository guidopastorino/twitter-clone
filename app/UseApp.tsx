// Creamos este componente para usar el metadata en el layout

"use client"

import React from 'react'
import App from '@/app/_app'
import useUser from '@/hooks/useUser';


const UseApp = ({ children }: { children: React.ReactNode }) => {

  useUser();

  return (
    <App>
      {children}
    </App>
  )
}

export default UseApp
"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { openModal, closeModal } from '@/state/modal/modalSlice'

const ModalsRouteChange: React.FC = () => {
  const dispatch = useDispatch()
  const [previousUrl, setPreviousUrl] = useState<string>("");

  useEffect(() => {
    const handleRouteChange = () => {
      const url = window.location.pathname
      
      setPreviousUrl(window.location.pathname)

      if (url === "/compose/post") {
        dispatch(openModal(<div>Compose Tweet</div>))
        window.history.replaceState(null, '', '/')
      } else {
        dispatch(closeModal())
      }
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('pushstate', handleRouteChange)
    window.addEventListener('replacestate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('pushstate', handleRouteChange)
      window.removeEventListener('replacestate', handleRouteChange)
    }
  }, [dispatch])


  useEffect(() => {
    if(previousUrl){
      window.history.pushState(null, '', previousUrl);
    }
  }, [previousUrl])

  return null
}

export default ModalsRouteChange
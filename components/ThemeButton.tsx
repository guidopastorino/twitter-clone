"use client"

import React, { useEffect, useState } from 'react'
import { WiMoonAltFirstQuarter } from "react-icons/wi"; // System
import { FiMoon } from "react-icons/fi"; // Dark
import { FiSun } from "react-icons/fi"; // Sun
import DropdownMenu from './DropdownMenu';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../state/theme/themeSlice';
import { RootState } from '../state/store';
import { useTheme } from 'next-themes';

const ThemeButton = () => {
  const dispatch = useDispatch();
  const { theme: themeFromRedux } = useSelector((state: RootState) => state.theme);
  const { setTheme: setNextTheme, resolvedTheme } = useTheme();

  // State to handle hydration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setNextTheme(themeFromRedux);
    }
  }, [themeFromRedux, setNextTheme, mounted]);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(theme));
  };

  if (!mounted) return null; // Avoid rendering until mounted

  const currentIcon = () => {
    if (themeFromRedux === 'system') {
      return <WiMoonAltFirstQuarter />; // Show system icon if 'system' is selected
    } else if (resolvedTheme === 'light') {
      return <FiSun />;
    } else if (resolvedTheme === 'dark') {
      return <FiMoon />;
    }
  }

  {/* dropdown menu here */ }
  return (
    <>
      {/* 
      <DropdownMenu
      button={<button className='w-10 h-10 flex justify-center items-center text-xl border rounded-full'>
        {currentIcon()}
      </button>}
    >
      <div className='shadow-lg py-1 w-max overflow-hidden rounded-lg dark:bg-neutral-800 bg-white'>
        <li onClick={() => handleThemeChange('light')} className='list-none p-2 flex justify-start items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-900 cursor-pointer py-2 px-4'><FiSun /> <span>Light</span></li>
        <li onClick={() => handleThemeChange('dark')} className='list-none p-2 flex justify-start items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-900 cursor-pointer py-2 px-4'><FiMoon /> <span>Dark</span></li>
        <li onClick={() => handleThemeChange('system')} className='list-none p-2 flex justify-start items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-900 cursor-pointer py-2 px-4'><WiMoonAltFirstQuarter /> <span>System</span></li>
      </div>
    </DropdownMenu>
      */}

      <div>theme</div>
    </>
  )
}

export default ThemeButton;

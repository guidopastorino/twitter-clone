"use client"

import React, { useEffect, useRef, useState } from 'react';

interface DropdownMenuProps {
  button: React.ReactElement;
  children: (
    // buttonRef: React.RefObject<HTMLButtonElement>,
    menuRef: React.RefObject<HTMLDivElement>,
    menu: boolean,
    setMenu: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode;
}

// Agregar más customización (posicion, efecto, etc...)
const DropdownMenu: React.FC<DropdownMenuProps> = ({ button, children }) => {
  const ButtonRef = useRef<HTMLButtonElement>(null);
  const MenuRef = useRef<HTMLDivElement>(null);

  const [menu, setMenu] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target === ButtonRef.current) return;
      if (!MenuRef.current?.contains(e.target as Node)) {
        setMenu(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // for bg:
  // <div className="w-full h-dvh bg-transparent cursor-default fixed z-40 top-0 left-0"></div>

  return (
    <>
      {menu && <div className="w-full h-dvh bg-transparent cursor-default fixed z-40 top-0 left-0"></div>}
      <div className='relative w-max shrink-0'>
        {React.cloneElement(button, { ref: ButtonRef, onClick: () => setMenu(!menu) })}
        <div className="absolute left-1/2 translate-x-[-50%] z-50" style={{ top: 'calc(100% + 10px)' }}>
          {children(MenuRef, menu, setMenu)}
        </div>
      </div>
    </>
  );
};

export default DropdownMenu;
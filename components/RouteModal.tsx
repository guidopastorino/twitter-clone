import { useModal } from '@/hooks/useModal';
import { RootState } from '@/state/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";

const RouteModal = () => {
  const { content, isOpen } = useSelector((state: RootState) => state.modal)
  const dispatch = useDispatch()

  useEffect(() => {
    const element: HTMLElement = document.body
    if (element) {
      element.classList.toggle("no-scrollbar", isOpen);
    }
  }, [isOpen])

  const { closeRouteModal } = useModal();

  if (!isOpen) return null;
  // bg-[#1d9bf0]/20
  return (
    <>
      <div onClick={closeRouteModal} className='w-full h-dvh fixed z-40 top-0 left-0 bg-[#85ceff]/15'></div>
      <div className="w-[90%] h-auto max-h-[90vh] max-w-[600px] left-1/2 translate-x-[-50%] bg-neutral-900 shadow-lg rounded-lg fixed z-50 top-10 dark:bg-black">
        <div className="flex flex-col gap-3">
          <div className="w-full flex justify-start items-center">
            {/* <button  className='w-9 h-9 flex justify-center items-center text-lg hover:dark:bg-neutral-700 hover:bg-gray-200 duration-100 active:brightness-75 active:scale-95 rounded-full' onClick={closeRouteModal}><RxCross2 /></button> */}
          </div>
          {content}
        </div>
      </div>
    </>
  );
};

export default RouteModal;
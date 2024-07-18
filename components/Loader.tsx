import React from 'react';
import '@/app/globals.css'

type Props = {
    width?: string;
    outlineColor?: string | null;
    strokeColor?: string | null;
}

const Loader = ({width, outlineColor, strokeColor}: Props) => {
    return (
        <svg viewBox="0 0 32 32" width={width || '30px'} className='object-contain shrink-0 rotate'>
            {/* full circle */}
            <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: outlineColor ? outlineColor : 'rgb(29, 155, 240)', opacity: 0.2 }}></circle>
            {/* 1/4 circle */}
            <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: strokeColor ? strokeColor : 'rgb(29, 155, 240)', strokeDasharray: 80, strokeDashoffset: 60 }}></circle>
        </svg>
    );
}

export default Loader;


export const PagesLoader = () => {
    return <div className="flex justify-center items-center h-full w-full"><Loader /></div>
}
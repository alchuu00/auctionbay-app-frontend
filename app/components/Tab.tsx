import React from 'react'

interface Props {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}
  
  const Tab:React.FC<Props> = ({ active, onClick, children }) => {
    return (
        <div
        className={`text-center gap-1 px-3 py-2 rounded-2xl w-32 cursor-pointer ${
          active ? "bg-dark-gray text-white" : ""
        }`}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }
  
  export default Tab
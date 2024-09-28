import React from 'react'

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full bg-black bg-opacity-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg">
        {' '}
        {/* Added relative class */}
        <button className="absolute px-4 py-2 top-2 right-2" onClick={onClose}>
          Close
        </button>
        <div className="py-4">{children}</div>
      </div>
    </div>
  )
}

import React from 'react'

const BlockPageLoader = () => {
  return (
    <div className="flex items-center justify-center  w-full h-full z-200 bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-orange-300 border-dashed rounded-full animate-spin"></div>
        <h1 className="text-xl font-semibold text-orange-500">Loading...</h1>
      </div>
    </div>
  )
}

export default BlockPageLoader

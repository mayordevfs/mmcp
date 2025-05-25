import React from 'react'

const ProductLoaders = () => {
  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-3 mt-4">
  {[...Array(8)].map((_, i) => (
    <div
      key={i}
      className="flex flex-col gap-y-2 bg-white rounded-lg shadow-md p-3 overflow-hidden animate-pulse"
    >
      <div className="w-full h-0 aspect-[4/3] bg-gray-200 rounded-lg" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="flex items-center justify-between">
        <span className="h-6 w-20 bg-gray-200 rounded-full" />
        <span className="h-4 w-8 bg-gray-200 rounded" />
      </div>
    </div>
  ))}
</div>

  )
}

export default ProductLoaders
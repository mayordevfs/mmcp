import React from 'react'

const CategoriesLoaders = () => {
  return (
    <div className="flex gap-x-3 mt-3">
  {[...Array(4)].map((_, i) => (
    <div
      key={i}
      className="p-2 flex h-[100px] w-[300px] flex-col justify-center gap-y-3 rounded-lg bg-white animate-pulse"
    >
      <span className="w-[25px] h-[25px] rounded-full bg-gray-200" />
      <span className="h-4 w-2/3 bg-gray-200 rounded" />
      <span className="h-3 w-1/3 bg-gray-200 rounded" />
    </div>
  ))}
</div>

  )
}

export default CategoriesLoaders
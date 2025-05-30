import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import CategoriesLoaders from './loaders/categories-loading';
import ErrorMessage from '../ui/error-message';
import { useTranslation } from 'next-i18next';

const Categories = () => {
  const {t} = useTranslation()
   const [page,setPage] = useState(1)
   const { data,isLoading,error } = useQuery({
  queryKey: ["categories"],
  queryFn: () => {
    return axiosInstanceNoAuth.request({
      method: "GET",
      url: '/products/categories',
      params: {
        name: "",
        entityCode: "ETZ",
        category: "",
        tag: '',
        pageNumber: page,
        pageSize: 200
      }
    })
    .then(response => response.data)
  }
});
if(isLoading) return <CategoriesLoaders/>
if (error) return <ErrorMessage message={t('Something went wrong!')}/>
console.log(data);

  return (
    <div className={`w-full overflow-x-auto grid  grid-cols-6 gap-y-3 gap-x-5 ${data?.categories.length<6?`lg:grid-cols-[${data?.categories?.length}]`:`lg:grid-cols-6`}`}>
        
        {data?.categories?.map((item:any,index:number)=>(
            <div key={index} className='p-2 flex h-[100px] flex-col justify-center transition-all duration-200 ease-in-out gap-y-3 rounded-lg cursor-pointer bg-white'>
                    <span
                className={`bg-[#f7f7f7] text-[#8B8B8B] w-[25px] h-[25px] rounded-full flex justify-center items-center`}
            >
                a
            </span>
             <span className={`text-sm font-semibold`}>
            {item.name}
          </span>
            </div>
        )

        )}


        {/* TODO: add pagination */}
    </div>
  )
}

export default Categories
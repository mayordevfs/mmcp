import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import CategoriesLoaders from './loaders/categories-loading';
import ErrorMessage from '../ui/error-message';
import { useTranslation } from 'next-i18next';
import { useProductCategoryQuery } from '@/data/pos/category';
import { ProductCategoriesProps } from '@/types';
import Image from 'next/image';
import useCategory from '@/stores/get_set_category';
import clsx from 'clsx';

const Categories = () => {
  const {t} = useTranslation()
   const [page,setPage] = useState(1)
   const {setCategory,category} = useCategory()
   const {data,error,isLoading} = useProductCategoryQuery(page)
if(isLoading) return <CategoriesLoaders/>
if (error) return <ErrorMessage message={t('Something went wrong!')}/>
console.log(data);

  return (
    <div className={`w-full overflow-x-auto grid  grid-cols-6 gap-y-3 gap-x-5 ${data?.length<6?`lg:grid-cols-[${data?.length}]`:`lg:grid-cols-6`}`}>
        
        {data?.map((item:ProductCategoriesProps,index:number)=>(
            <button key={index} 
            className={clsx(
              'p-2 flex h-[100px] flex-col justify-center transition-all duration-200 ease-in-out gap-y-3 rounded-lg cursor-pointer bg-white hover:',
              item?.name === category && 'border-blue-600 border-[2px]' 
            )}

            onClick={()=>setCategory(item?.name as string)}
            >
                    <span
                className={`bg-[#f7f7f7] text-[#8B8B8B] w-[25px] h-[25px] rounded-full flex justify-center items-center`}
            >
                {item?.logo?<Image
                  src={item?.logo}
                  alt={item?.name}
                  height={20}
                  width={20}
                />:'a'}
                
            </span>
             <span className={`text-sm font-semibold`}>
            {item.name}
          </span>
            </button>
        )

        )}


        {/* TODO: add pagination */}
    </div>
  )
}

export default Categories
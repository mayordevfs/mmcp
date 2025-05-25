import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';
import { formatPrice } from '@/utils/use-price';
import Image from 'next/image'
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import ProductDetail from './product-detail';
import Pagination from '../ui/pagination';
import ProductLoaders from './loaders/products-loading';
import ErrorMessage from '../ui/error-message';
import { useTranslation } from 'next-i18next';

const Products = () => {
    const { t } = useTranslation();
    const [page,setPage] = useState(1)
    const [product,setProduct] = useState(null)
    const [isProductModal,setisProductModal] = useState(false)
    const openModal = (product:any)=>{
    setisProductModal(true)
    setProduct(product)
 }
    const { data,isLoading,error } = useQuery({
  queryKey: ["products",page],
  queryFn: () => {
    return axiosInstanceNoAuth.request({
      method: "GET",
      url: '/products/list',
      params: {
        name: "",
        entityCode: "ETZ",
        category: "",
        tag: '',
        pageNumber: page,
        pageSize: 10
      }
    })
    .then(response => response.data)
  },
  keepPreviousData:true
});
const newPaginatorInfo = {
    currentPage: page,
    firstPageUrl: '',
    from: 1,
    lastPage:data?.totalPages,
    lastPageUrl: '',
    links: [],
    nextPageUrl: null,
    path: '',
    perPage: 10,
    prevPageUrl: null,
    to: 10,
    total:data?.totalCount,
    hasMorePages:data?.totalPages > page,
  };
  function handlePagination(current: number) {
    setPage(current);
  }
if(isLoading) return <ProductLoaders/>
if (error) return <ErrorMessage message={t('Something went wrong!')}/>
console.log(data);

  return (
    <>
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-x-2 gap-y-3 mt-3">
        {
            data?.products?.map((item:any)=>(
                <div key={item?.id} 
                className='flex flex-col gap-y-2 h-fit bg-white rounded-lg shadow-md p-3'
                onClick={()=>openModal(item)}
                >
                    <div className="w-full flex-1 h-full bg-[#f7f7f7] rounded-lg overflow-hidden relative aspect-[4/3]">
                        <Image
                            src={item?.picture} 
                            alt={"Menu item"}
                            height={150}
                            width={150}
                            className="object-cover object-center"
                            loading="lazy" // Default in Next.js but explicit for clarity
                />
                    </div>
                    <p>{item?.name}</p>
                        <div className="flex items-center justify-between">
                            <span className={`p-2 text-[11px]  rounded-full font-semibold`}>{item?.category}</span>
                            <span>{formatPrice({amount:item?.salePrice,currencyCode:"NGN",locale:'ng'})}</span>
                        </div>
                </div>
            ))
        }
        {
            isProductModal&& <ProductDetail
            data={product}
            onClose={()=>setisProductModal(false)}
            open={isProductModal}
            />
        }


        {/* TODO: Add pagination */}
    </div>
    <div className='flex w-full justify-end'>
          <Pagination
            total={newPaginatorInfo?.total}
            current={newPaginatorInfo?.currentPage}
            pageSize={newPaginatorInfo?.perPage}
            onChange={handlePagination}
            className='mt-3'
          />
        </div>
    </>
  )
}

export default Products
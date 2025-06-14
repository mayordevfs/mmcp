import axiosInstanceNoAuth from '@/utils/fetch-function-no-auth';
import { formatPrice } from '@/utils/use-price';
import Image from 'next/image';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import ProductDetail from './product-detail';
import Pagination from '../ui/pagination';
import ProductLoaders from './loaders/products-loading';
import ErrorMessage from '../ui/error-message';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import useCategory from '@/stores/get_set_category';
import { Edit } from 'lucide-react';

const Products = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [product, setProduct] = useState(null);
    const [isProductModal, setisProductModal] = useState(false);
    const { category } = useCategory();

    const openModal = (product: any) => {
        setisProductModal(true);
        setProduct(product);
    };

    const handleEdit = (product: any, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the modal
        
        // Store product data in session storage
        sessionStorage.setItem('editingProduct', JSON.stringify(product));
        
        // Navigate to edit page
        router.push(`/pos/edit_product/${product.id}`);
    };
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["products", page, category],
        queryFn: () => {
            return axiosInstanceNoAuth.request({
                method: "GET",
                url: '/products/list',
                params: {
                    name: "",
                    entityCode: "ETZ",
                    // entityId:"101",
                    category: category,
                    tag: '',
                    pageNumber: page,
                    pageSize: 200
                }
            })
            .then(response => response.data);
        },
        keepPreviousData: true
    });

    const newPaginatorInfo = {
        currentPage: page,
        firstPageUrl: '',
        from: 1,
        lastPage: data?.totalPages,
        lastPageUrl: '',
        links: [],
        nextPageUrl: null,
        path: '',
        perPage: 200,
        prevPageUrl: null,
        to: data?.products?.length || 0,
        total: data?.totalCount,
        hasMorePages: data?.totalPages > page,
    };

    function handlePagination(current: number) {
        setPage(current);
    }

    if (isLoading) return <ProductLoaders />;
    if (error) return <ErrorMessage message={t('Something went wrong!')} />;
    console.log(data);

    return (
        <>
            <div className="grid lg:grid-cols-6 grid-cols-2 gap-x-2 gap-y-3 mt-3">
                {data?.products?.map((item: any) => (
                    <div 
                        key={item?.id} 
                        className='flex flex-col gap-y-2 bg-white rounded-lg shadow-md p-3 relative group cursor-pointer hover:shadow-lg transition-shadow duration-200 w-full'
                        onClick={() => openModal(item)}
                    >
                        {/* Edit Button - appears on hover */}
                        <button
                            onClick={(e) => handleEdit(item, e)}
                            className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-lg"
                            title="Edit product"
                        >
                            <Edit size={13} />
                        </button>

                        <div className="w-full flex-1 h-full rounded-lg overflow-hidden relative aspect-[4/3] border-b">
                            <Image
                                src={item?.picture || "/logo.svg"} 
                                alt={"Menu item"}
                                layout='fill'
                                className="object-cover object-center"
                                loading="lazy"
                            />
                        </div>
                        <p className='text-[10px] truncate'>{item?.name}</p>
                        <div className="flex items-center justify-between w-full">
                            <span className={`p-2 text-[10px] rounded-full font-semibold truncate max-w-[50%]`}>
                                {item?.category}
                            </span>
                            <span className='text-[12px] font-bold truncate'>
                                {formatPrice({ amount: item?.salePrice, currencyCode: "NGN", locale: 'ng' })}
                            </span>
                        </div>
                    </div>
                ))}
                
                {isProductModal && (
                    <ProductDetail
                        data={product}
                        onClose={() => setisProductModal(false)}
                        open={isProductModal}
                    />
                )}
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
    );
};

export default Products;
import { ProductCategoriesProps } from "@/types";
import axiosInstanceNoAuth from "@/utils/fetch-function-no-auth";
import { useQuery } from "react-query";


export const useProductCategoryQuery = (page:number)=>{
    const { data, error, isLoading } = useQuery(
        ['categories',page],
        ()=>axiosInstanceNoAuth.request({
            method:'GET',
            url:'/products/categories',
            params:{
                name: "",
                entityCode: "ETZ",
                category: "",
                tag: '',
                pageNumber: page||undefined,
                pageSize: 200
            }
        })
    )

    
    

    return{
        data: data?.data.categories as ProductCategoriesProps[],
        error: error,
        isLoading: isLoading
    }
}
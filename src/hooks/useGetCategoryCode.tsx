import axiosInstance from '@/utils/fetch-function'
import React from 'react'
import { useQuery } from 'react-query'

const useGetCategoryCode = () => {
  const {data} = useQuery(
      ['cate-code'],
      ()=>axiosInstance.request({
        method:'GET',
        url:'lookupdata/new-list',
        params:{
           entityCode:'ETZ',
          categoryCode:'CATEGORY_CODE'
        },
        headers:{
          'x-source-code':'MMCP',
          'x-client-id':'TST03054745785188010772',
          'x-client-secret':'TST03722175625334233555707073458615741827171811840881'
        }
      })
    )
  
  return {
    data
  }
}

export default useGetCategoryCode
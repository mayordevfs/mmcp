import axiosInstanceNoAuth from "@/utils/fetch-function-no-auth"
import { useQuery } from "react-query"


export const useExchangeRates = ()=>{
    const {data,isError,isLoading} = useQuery(
    ["exchange-rate"],
    ()=>axiosInstanceNoAuth.request({
      url:'exchange-rate/rateBoard',
      method:"GET",
      params:{
        customerCategory:"Tier 1"
      }
    })
  )

  return{
    data,
    isError,
    isLoading
  }
} 
import ExchangeRateBoard from '@/components/money_transfer/exchange_rate/exchangeRateBoard'
import Header from '@/components/money_transfer/landing_page/header'
import Button from '@/components/ui/button'
import { Routes } from '@/config/routes'
import { useMeQuery } from '@/data/user'
import axiosInstance from '@/utils/fetch-function'
import Link from 'next/link'
import React from 'react'

const MoneyTransferLanding  = () => {
  // const {data} = useMeQuery()
  
  
  return (
    <div>
        <Header/>
        
    </div>
  )
}

export default MoneyTransferLanding
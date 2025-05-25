import ExchangeRateBoard from '@/components/money_transfer/landing_page/exchangeRateBoard'
import Button from '@/components/ui/button'
import { Routes } from '@/config/routes'
import Link from 'next/link'
import React from 'react'

const MoneyTransferLanding  = () => {
  return (
    <div>
        <div className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exchange Rate Dashboard</h1>
        <div className="flex gap-2">
          <Link href={Routes?.send_money}>
            <Button variant="custom" className='border hover:bg-gray-100'>Money Transfer</Button>
          </Link>
          <Link href="/pos">
            <Button>Go to Store</Button>
          </Link>
        </div>
      </div>
      <ExchangeRateBoard/>
    </div>
  )
}

export default MoneyTransferLanding
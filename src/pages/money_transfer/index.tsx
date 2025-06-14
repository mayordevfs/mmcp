import ExchangeRateBoard from '@/components/money_transfer/exchange_rate/exchangeRateBoard'
import CustomerSegmentsSection from '@/components/money_transfer/landing_page/customer-segment'
import FooterSection from '@/components/money_transfer/landing_page/footer'
import Header from '@/components/money_transfer/landing_page/header'
import HeroSection from '@/components/money_transfer/landing_page/hero-section'
import KeyServicesSection from '@/components/money_transfer/landing_page/key-services'
import PartnerNetworkSection from '@/components/money_transfer/landing_page/partner-network'
import ProblemSolutionSection from '@/components/money_transfer/landing_page/problem-solution'
import TargetMarketsSection from '@/components/money_transfer/landing_page/target-market'
import WhyChooseSection from '@/components/money_transfer/landing_page/why-choose'
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
        <HeroSection/>
        <ProblemSolutionSection/>
        <KeyServicesSection/>
        <TargetMarketsSection/>
        <CustomerSegmentsSection/>
        <WhyChooseSection/>
        <PartnerNetworkSection/>
        <FooterSection/>
    </div>
  )
}

export default MoneyTransferLanding
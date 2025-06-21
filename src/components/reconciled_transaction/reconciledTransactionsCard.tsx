import React from 'react'
import StickerCard from '../widgets/sticker-card'
import { ReconciliationIcon } from '../icons/sidebar'
import { UnreconciledIcon } from '../icons/unreconciled-transactions'
import { MissingTransactionsIcon } from '../icons/missing-transactions-'
import { RateIcon } from '../icons/rate-icon'

const ReconciledTransactionsCards = () => {
  return (
    <div className='flex flex-col gap-y-3  md:flex-row md:gap-x-3 w-full justify-between mb-8'>
      <StickerCard
      titleTransKey="Reconciled/Match"
      price="20"
      icon={<ReconciliationIcon className='h-6 w-6'/>}
      />
      <StickerCard
      titleTransKey="Unreconciled"
      price="20"
      icon={<UnreconciledIcon className='h-6 w-6'/>}
      />
      <StickerCard
      titleTransKey="Missing Trans."
      price="20"
      icon={<MissingTransactionsIcon className='h-6 w-6'/>}
      />
      <StickerCard
      titleTransKey="Reconcile Rate"
      price="20"
      icon={<RateIcon className='h-6 w-6'/>}
      />
    </div>
  )
}

export default ReconciledTransactionsCards
import { Banknote } from 'lucide-react'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import SelectInput from '@/components/ui/select-input'
import React from 'react'
import { Control } from 'react-hook-form'
import { EnhancedMoneyTransferFormData } from '@/types'

interface TransferDetailsProps {
  control: Control<EnhancedMoneyTransferFormData>
  currencies: Array<{ code: string; name: string }>
}

const TransferDetails: React.FC<TransferDetailsProps> = ({ control, currencies }) => {
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Banknote className="h-5 w-5" />
        Transfer Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sendCurrency" className="text-sm font-medium text-gray-700">
            Send Currency
          </Label>
          <SelectInput
            name='sendCurrency'
            control={control}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.code}
            options={currencies}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amountToSend" className="text-sm font-medium text-gray-700">
            Amount to Send *
          </Label>
          <Input
            inputClassName='bg-white'
            id="amountToSend"
            name='amountToSend'
            type="number"
            placeholder="0.00"
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="receiveCurrency" className="text-sm font-medium text-gray-700">
            Receive Currency
          </Label>
          <SelectInput
            name='receiveCurrency'
            control={control}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.code}
            options={currencies}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amountToReceive" className="text-sm font-medium text-gray-700">
            Amount to Receive *
          </Label>
          <Input
            inputClassName='bg-white'
            id="amountToReceive"
            name='amountToReceive'
            type="number"
            placeholder="0.00"
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>
    </div>
  )
}

export default TransferDetails
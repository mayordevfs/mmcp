import { CreditCard, Loader } from 'lucide-react'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import SelectInput from '@/components/ui/select-input'

import React from 'react'
import { Control } from 'react-hook-form'
import { EnhancedMoneyTransferFormData } from '@/types'
import FileUpload from './file-upload'

interface RecipientBankDetailsProps {
  control: Control<EnhancedMoneyTransferFormData>
  currencies: Array<{ code: string; name: string }>
  uploadedId: FileList|null
  uploadedReceipt: FileList|null
  onIdUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onReceiptUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveId: () => void
  onRemoveReceipt: () => void
  isUploading:boolean
}

const RecipientBankDetails: React.FC<RecipientBankDetailsProps> = ({
  control,
  currencies,
  uploadedId,
  uploadedReceipt,
  onIdUpload,
  onReceiptUpload,
  onRemoveId,
  onRemoveReceipt,
  isUploading
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Recipient Bank Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="selectBank" className="text-sm font-medium text-gray-700">
            Select Bank *
          </Label>
          <SelectInput
            name='bank'
            control={control}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.code}
            options={currencies}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">
            Enter Account Number *
          </Label>
          <Input
            inputClassName='bg-white'
            id="accountNumber"
            name='accountNumber'
            type="text"
            placeholder="Enter Account Number"
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="holderName" className="text-sm font-medium text-gray-700">
            Account Name *
          </Label>
          <Input
            inputClassName='bg-white'
            id="holderName"
            name='accountHolderName'
            type="text"
            placeholder="Enter Account Holder Name"
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      </div>

      {/* Document Upload Section */}
      {
        isUploading? <Loader size={20} color='blue' className='animate-spin'/>
        :
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FileUpload
          id="idUpload"
          label="Upload ID"
          uploadedFile={uploadedId}
          onFileChange={onIdUpload}
          onRemoveFile={onRemoveId}
        />
        <FileUpload
          id="receiptUpload"
          label="Upload Receipt"
          uploadedFile={uploadedReceipt}
          onFileChange={onReceiptUpload}
          onRemoveFile={onRemoveReceipt}
        />
      </div>
      }
    </div>
  )
}

export default RecipientBankDetails
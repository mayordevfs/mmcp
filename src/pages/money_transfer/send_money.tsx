import Card from '@/components/common/card'
import FormHeader from '@/components/money_transfer/send/form-header'
import RecipientBankDetails from '@/components/money_transfer/send/receipient-details'
import SenderInformation from '@/components/money_transfer/send/sender_information'
import TransferDetails from '@/components/money_transfer/send/transfer-details'
import Button from '@/components/ui/button'
import { EnhancedMoneyTransferFormData } from '@/types'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' }
];

const banks = [
  'Chase Bank',
  'Bank of America',
  'Wells Fargo',
  'Citibank',
  'HSBC',
  'Standard Chartered',
  'JPMorgan Chase',
  'Goldman Sachs',
  'Morgan Stanley',
  'Barclays'
];

export const defaultFormValues: EnhancedMoneyTransferFormData = {
  name: '',
  phoneNumber: '',
  email: '',
  sendCurrency: { code: 'USD', name: 'US Dollar' },
  amountToSend: 0,
  receiveCurrency: { code: 'EUR', name: 'Euro' },
  amountToReceive: 0,
  bank: '',
  accountNumber: '',
  accountHolderName: '',
};

const SendMoney = () => {
  const { register, handleSubmit, control, getValues } = useForm<EnhancedMoneyTransferFormData>({
    shouldUnregister: true,
  });

  const [uploadedId, setUploadedId] = useState<File | null>(null);
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null);

  const handleIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedId(file);
    }
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedReceipt(file);
    }
  };

  const removeIdFile = () => {
    setUploadedId(null);
    const input = document.getElementById('idUpload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const removeReceiptFile = () => {
    setUploadedReceipt(null);
    const input = document.getElementById('receiptUpload') as HTMLInputElement;
    if (input) input.value = '';
  };

  const onSubmit = (data: EnhancedMoneyTransferFormData) => {
    console.log('Form Data:', data);
    console.log('Uploaded ID:', uploadedId);
    console.log('Uploaded Receipt:', uploadedReceipt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <FormHeader />
          
          <div className="space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <SenderInformation />
              
              <TransferDetails 
                control={control} 
                currencies={currencies} 
              />
              
              <RecipientBankDetails
                control={control}
                currencies={currencies}
                uploadedId={uploadedId}
                uploadedReceipt={uploadedReceipt}
                onIdUpload={handleIdUpload}
                onReceiptUpload={handleReceiptUpload}
                onRemoveId={removeIdFile}
                onRemoveReceipt={removeReceiptFile}
              />

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Submit Transfer Request
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SendMoney
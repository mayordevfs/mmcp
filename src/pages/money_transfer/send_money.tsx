import Card from '@/components/common/card'
import { useDocUpload } from '@/components/money_transfer/hooks/useDocUpload'
import FormHeader from '@/components/money_transfer/send/form-header'
import RecipientBankDetails from '@/components/money_transfer/send/receipient-details'
import SenderInformation from '@/components/money_transfer/send/sender_information'
import TransferDetails from '@/components/money_transfer/send/transfer-details'
import Button from '@/components/ui/button'
import useGetLookup from '@/hooks/useGetLookup'
import { random20DigitNumber } from '@/lib/helper'
import useUser_transfer from '@/stores/userStoreTransfer'
import { EnhancedMoneyTransferFormData } from '@/types'
import { authenticatedUser } from '@/utils/auth-transfer-utils'
import { adminOnly } from '@/utils/auth-utils'
import axiosInstance from '@/utils/fetch-function-money-transfer'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

// const banks = [
//   'Chase Bank',
//   'Bank of America',
//   'Wells Fargo',
//   'Citibank',
//   'HSBC',
//   'Standard Chartered',
//   'JPMorgan Chase',
//   'Goldman Sachs',
//   'Morgan Stanley',
//   'Barclays'
// ];

export const defaultFormValues: EnhancedMoneyTransferFormData = {
  name: '',
  phoneNumber: '',
  email: '',
  sendCurrency: null,
  amountToSend: 0,
  receiveCurrency: null,
  bank: '',
  accountNumber: '',
  accountHolderName: '',
};

const SendMoney = () => {
  const { register, handleSubmit, control, setValue, watch, formState } = useForm<EnhancedMoneyTransferFormData>({
    shouldUnregister: false, // Changed to false to prevent losing form data
    defaultValues: defaultFormValues,
    mode: 'onChange' // Enable real-time validation and watching
  });
  // const banks = useGetLookup('Bank')
  // console.log(banks);
  
  const receiveCurrency = watch('receiveCurrency')
  const sendCurrency = watch('sendCurrency')

  console.log(receiveCurrency);
  
  const {user} = useUser_transfer()
  console.log(user);
  
  const [amountToReceive,setAmountToReceive] = useState(0)

  const [uploadedId, setUploadedId] = useState<FileList | null>(null);
  const [uploadedReceipt, setUploadedReceipt] = useState<FileList | null>(null);

  const handleIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      setUploadedId(file);
    }
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
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

  const idFile = useDocUpload(uploadedId)
  const receiptFile = useDocUpload(uploadedReceipt)

  console.log(idFile.fileUrl);
  console.log(receiptFile.fileUrl);
  
  

  // Mutation

  const {} = useMutation(
    (data)=>axiosInstance.request({
      url:'/stable/fundTransfer',
      method:'POST',
      data
    }),
    {
      onSuccess:(response)=>{
        if (response?.data?.responseCode!=='00') {
          toast.error('Something went wrong!')
        }

        else{
          // TODO: DO something
        }
        
      },
      onError:(error)=>{
        console.log(error);
        
        toast.error('Error sending money!')
      }
    }
  )
  console.log(uploadedReceipt);
  
  const onSubmit = (data: EnhancedMoneyTransferFormData) => {
    console.log('Form Data:', data);
    console.log('Uploaded ID:', uploadedId);
    console.log('Uploaded Receipt:', uploadedReceipt);
    const payload ={
      sendAmount:data?.amountToSend,
      receiveAmount:data?.amountToReceive,
      
      sendCcy:sendCurrency?.code,
      receiveCcy:receiveCurrency?.code,
      purpose:'Family',
      paymentMode:'AGENT',
      senderRefNo:random20DigitNumber(), // (calculated) generate 15 digit random No
      
      paymentSource:'CASH|TRANSFER',

      senderAccount:'',
      senderName:data?.name,
      senderEmail:data?.email,
      senderMobile:data?.phoneNumber,
      senderIdLink:idFile.fileUrl||'',
      receiptLink:receiptFile?.fileUrl||'',

      beneficiaryAccount:data?.accountNumber,
      beneficiaryName:data?.accountHolderName,
      beneficiaryBankCOde:'050',
      beneficiaryBankName:data?.bank,
      beneficiaryAccType:'Savings',

      geolocation:'37.7749,-122.4194',
      deviceId: user?.deviceID
    }
  };

  // Debug: Log form values to see what's happening
  const formValues = watch();
  console.log('Current form values:', formValues);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <FormHeader />
          
          <div className="space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <SenderInformation 
                control={control}
                register={register}
              />
              
              <TransferDetails 
                control={control}
                setValue={setValue}
                watch={watch}
                register={register}
                amountToReceive={amountToReceive}
                setAmountToReceive = {setAmountToReceive}
              />
              
              <RecipientBankDetails
                control={control}
                currencies={[]} // This will now come from the API in TransferDetails
                uploadedId={uploadedId}
                uploadedReceipt={uploadedReceipt}
                onIdUpload={handleIdUpload}
                onReceiptUpload={handleReceiptUpload}
                onRemoveId={removeIdFile}
                onRemoveReceipt={removeReceiptFile}
                isUploading = {receiptFile?.isUploadingFile}
              />

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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

SendMoney.authenticateTransfer = {
  permissions : authenticatedUser
}
export default SendMoney
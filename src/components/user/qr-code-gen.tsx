import React from 'react'
import { useModalState } from '../ui/modal/modal.context'
import { useQuery } from 'react-query'
import axiosInstance from '@/utils/fetch-function'
import ErrorMessage from '../ui/error-message'
import Loader from '../ui/loader/loader'
import QRCode from 'react-qr-code'

const GenerateUserQr = () => {
  const {data} = useModalState()

  const {data:two_fa,isError,isLoading} = useQuery(
    ['usermanager2fa'],
    ()=>axiosInstance.request(
      {
        url:'/usermanager/generate2falink',
        method:'GET',
        params:{
          username:data?.user?.email
        }
      }
    )
  )

  if(isError) return <ErrorMessage message='Something went wrong!'/>
  if(isLoading) return <Loader/>

  console.log(two_fa);
  
  console.log(data?.user);
  
  return (
    <div className="m-auto w-[800px] rounded bg-white p-8 h-[60vh] overflow-y-auto shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Generate Qr Code</h2>
        <div className="w-full h-px bg-blue-300 mb-4"></div>
      </div>

      <div>
        <QRCode
        className='w-[200px] h-[200px] mx-auto'
        value={two_fa?.data?.id}
        />
      </div>
    </div>
  )
}

export default GenerateUserQr
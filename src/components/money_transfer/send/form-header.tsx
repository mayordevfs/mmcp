import { ArrowRightLeft } from 'lucide-react'
import React from 'react'

const FormHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4 pb-6">
      <div className="flex justify-center">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full">
          <ArrowRightLeft className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Money Transfer
      </div>
      <div className="text-lg text-gray-600">
        Send money securely to your recipients worldwide
      </div>
    </div>
  )
}

export default FormHeader
import { SendIcon } from 'lucide-react'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import React from 'react'

const SenderInformation: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <SendIcon className="h-5 w-5" />
        Sender Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="senderName" className="text-sm font-medium text-gray-700">
            Sender Name *
          </Label>
          <Input
            id="senderName"
            inputClassName='bg-white'
            type="text"
            placeholder="Enter full name"
            name='name'
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">
            Mobile Number *
          </Label>
          <Input
            id="mobileNumber"
            inputClassName='bg-white'
            type="tel"
            placeholder="+1 (555) 123-4567"
            name='phoneNumber'
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <Input
            id="email"
            inputClassName='bg-white'
            type="email"
            placeholder="your.email@example.com"
            name='email'
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 bg-white"
            required
          />
        </div>
      </div>
    </div>
  )
}

export default SenderInformation
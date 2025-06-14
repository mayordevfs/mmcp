"use client"
import { AlertCircle } from "lucide-react"
import Head from "next/head"
import { useForm, Controller } from "react-hook-form"
import useGetLookup from "@/hooks/useGetLookup"
import Input from "@/components/ui/input"
import Label from "@/components/ui/label"
import SelectInput from "@/components/ui/select-input"
import { useTranslation } from "next-i18next"

export default function UsdtTransfer() {
  const banks = useGetLookup('BANK')
  const {t} = useTranslation()
   
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      orderId: "",
      otp: "",
      bank: banks[0],
    },
  })

  console.log(banks);
  

  const onSubmit = async (data:any) => {
    // Simulate API call
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert("Transfer request submitted!")
  }

  return (
    <>
      <Head>
        <title>USDT Transfer to Bank</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
            <h1 className="text-2xl font-bold text-white">USDT Transfer to Bank</h1>
            <p className="text-blue-100 mt-1">Buy USDT</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Order ID Field */}
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Enter Order Id:
              </label>
              <div className="relative rounded-md shadow-sm">
                <Input
                    {...register('orderId')}
                    variant="outline"
                    className="mb-5"
                    placeholder="Enter OrderId"
                />
              </div>
              {errors.orderId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.orderId.message}
                </p>
              )}
            </div>

            {/* Bank section  */}
            <div className="mb-5">
            <Label>{t('Choose Bank')}</Label>
            <SelectInput
              name="bankCode"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={banks}
            />
          </div>

            {/* OTP Field */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP:
              </label>
              <div className="relative rounded-md shadow-sm">
                <Input
                    {...register('otp')}
                    variant="outline"
                    className="mb-5"
                    placeholder="Enter 6-digits OTP"
                />
              </div>
              {errors.orderId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.orderId.message}
                </p>
              )}
            </div>

            {/* Save Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70"
              >
                {isSubmitting ? "Processing..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

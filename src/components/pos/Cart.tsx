import { useCart } from '@/stores/cart'
import Image from 'next/image'
import React, { useState } from 'react'
import { EditIcon } from '../icons/edit'
import { formatPrice } from '@/utils/use-price'
import AddCustomerModal from './add-customer-modal'
import { useMutation } from 'react-query'
import axiosInstance from '@/utils/fetch-function'
import { toast } from 'react-toastify'
import { Minus, Plus, X } from 'lucide-react'

import { useTranslation } from 'next-i18next'
import useUser from '@/stores/userStore'

interface CustomerInfoProps{
    contactName: string;
    contactEmail: string;
    contactPhone: string;
}
const Cart = () => {
    const {t} = useTranslation()
    const {cart,decrement,increment,getCartTotal,removeItem,clearCart} = useCart()
    const [isModal,setIsModal] = useState(false)
    const {user} = useUser()
    const [customerData,setCustomerData] =useState<CustomerInfoProps|null>(null)
   console.log(user);
   
    // Update the handleCustomerSubmit function to:
const handleCustomerSubmit = (data: CustomerInfoProps) => {
    // Here you can handle the customer data submission
    setCustomerData({
        contactEmail: data.contactEmail,
        contactName: data.contactName,
        contactPhone: data.contactPhone
    })
    console.log('Customer data submitted:', data);
    setIsModal(false); // Close the modal after submission
};
    const {mutate:saveOrder,isLoading,data} = useMutation(

        (data:any)=>axiosInstance.request({
            method:"POST",
            url:"stock-management/sale",
            data:data,
            params:{
                storeId: "2001",
                entityId:"ETZ",
                username:user?.username
            }
        }),
        {
            onSuccess: (data) => {
                    if (data?.data?.code !== '000') {
                      toast.error(data?.data?.desc);
                      return;
                    }
                    toast.success('Order saved successfully');
                    clearCart()
                    setCustomerData(null);
                  },
            onError: (error: any) => {
        console.log(error);

        if (error?.response?.data) {
          if (error.response.status === 400) {
            toast.error('Bad request: ' + (error.response.data.message || 'Unknown error'));
          } else if (error.response.status === 422) {
            toast.error("Error saving order");
          } else if (error.response.status === 500) {
            toast.error("Error saving order");
          }
        } else {
          toast.error("Error saving order");
        }
      },
        },
        
    )

    const submitOrder =async ()=>{
        if(!customerData){
            return
        }
        const orders = cart?.map(item=>({
            itemCode:item?.code,
            qty:item?.quantity,
            unit:item?.unit,
            itemName:item?.name,
            itemLogo:item?.picture,
            unitPrice:item?.salePrice,
            amount:item?.subTotal
        }))
        const payload = {
            id: 0,
            orderNo: "",
            orderDirection: "SALE",
            contactName: customerData?.contactName,
            contactID: "0",
            contactMobile: customerData?.contactPhone,
            contactEmail: customerData?.contactEmail,
            contactAddress: "123 Customer Street",
            orderDate: "03-20-2024",
            paymentTerm: "0",
            deliveryAddress: "456 Delivery Ave",
            deliveryDate: "03-22-2024",
            storeId: "2001",
            totalAmount: getCartTotal(),
            subTotalAmount: getCartTotal(),
            taxAmount: 0.00,
            totalDiscount: 0.00,
            cashChange: 0.00,
            ccy: user?.ccy,
            paymentMethod: "CARD",
            amountOwed: 0.00,
            amountPaid: getCartTotal(),
            geolocation: "40.7128,-74.0060",
            paymentChannel: "POS",
            cashReceived: 0.00,
            deliveryFee: 0.00,
            deliveryArea: "",
            deliveryTime: "",
            couponCode: "",
            exchRate: 1.0,
            dueDate: "",
            orders
    }
        saveOrder(payload)
    }

    console.log(data);
    
    
  return (
    <div className='container space-y-2 flex flex-col h-full'>
        {customerData?<div className='flex items-center justify-between p-2 mb-1 shadow-md'>
            <span className='text-[12px] text-center font-medium'>{t("common:text-customer")}: {customerData?.contactName}</span>
            <button className='w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-white' onClick={()=>setCustomerData(null)}><X size={12}/></button>
        </div>:<button className='flex items-center justify-between p-2 mb-1 shadow-md' onClick={()=>setIsModal(true)}>
            <span className='text-[12px]'>{t("common:text-add-customer")}</span>
            <span className='w-4 h-4 flex items-center justify-center rounded-full bg-blue-700 text-white'><Plus size={12}/></span>
        </button>}

        {/* cart items - Made more compact */}
        <div className='flex-1 h-full overflow-y-auto space-y-1 w-full text-[12px]'>
        {
            cart?.length<1?<div className='w-full h-full flex items-center justify-center'>
                <p className='text-[13px]'>{t("common:text-no-item-in-cart")}</p>
            </div>:cart?.map((item,index)=>(
                <div key={index} className={`flex ${index===cart.length-1&&"border-none"} border-b border-dashed py-2 px-2 gap-x-2 items-center`}>
                    {/* Smaller image container */}
                    <div className='w-[32px] h-[32px] flex items-center justify-center bg-[#f7f7f7] rounded-md flex-shrink-0'>
                        <Image src={item?.picture} alt={'Cart image'} height={40} width={40} className='h-[80%] w-[80%] object-contain'/>
                    </div>
                    
                    <div className='flex-1 min-w-0'>
                        {/* Product name and price in one row */}
                        <div className='flex justify-between items-start mb-1'>
                            <div className='flex-1 min-w-0 pr-2'>
                                <p className='text-[11px] font-medium line-clamp-1 leading-tight'>{item?.name?.length!>35?`${item?.name?.slice(0,35)}...`:item?.name}</p>
                                <p className='text-[10px] text-[#9f9f9f] font-semibold'>{formatPrice({
                                    amount:item?.subTotal,
                                    currencyCode:'NGN',
                                    locale:'ng'
                                })}</p>
                            </div>
                            <button 
                                className="h-4 w-4 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 flex-shrink-0"
                                onClick={()=>removeItem(item?.id)}
                            >
                                <X size={10}/>
                            </button>
                        </div>
                        
                        {/* Controls row */}
                        <div className='flex justify-between items-center'>
                            <div className='icon-container flex-shrink-0'>
                                <EditIcon color='#9f9f9f' className="w-3 h-3"/>
                            </div>
                            <div className="bg-gray-50 rounded-full flex justify-between gap-x-1 items-center p-0.5">
                                <button 
                                    className="h-4 w-4 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"
                                    onClick={()=>{
                                        decrement(item)
                                    }}
                                >
                                    <Minus size={10}/>
                                </button>
                                <span className="font-medium text-[10px] px-1">{item?.quantity}</span>
                                <button 
                                    className="h-4 w-4 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"
                                    onClick={()=>increment(item)}
                                >
                                    <Plus size={10}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        }
       </div>
       
       {/* cart summary - Made more compact */}
      {
        cart?.length>0&& <div className='flex-[0.6] relative border-t border-double flex flex-col'>
            <div className='flex-1 p-2 text-[12px] space-y-1'>
                <div className='flex items-center'>
                    <p className='flex-1'>{t("common:text-subtotal")}</p>
                    <div className='flex-[0.4] flex justify-end items-center'>
                        <span className='text-[12px]'>{formatPrice({
                                    amount:getCartTotal(),
                                    currencyCode:'',
                                    locale:''
                     })}</span>
                    </div>
                </div>
            </div>
            <div className='flex items-center text-[12px] flex-[0.3] border-t border-dashed p-2'>
                    <p className='flex-1 font-bold text-[14px]'>{t("common:text-total")}</p>
                    <div className='flex-[0.4] flex justify-end items-center'>
                        <span className='text-[14px] font-semibold'>{formatPrice({
                                    amount:getCartTotal(),
                                    currencyCode:'',
                                    locale:''
                        })}</span>
                    </div>
                </div>
            <button className='bg-blue-700 text-white font-semibold text-center flex-[0.5] w-full h-full text-[13px]' onClick={submitOrder}>
                {isLoading?t("common:text-please-wait"):t("common:text-place-order")}
            </button>
       </div>
      }
      <AddCustomerModal
        open={isModal}
        onClose={()=>setIsModal(false)}
        handleCustomerSubmit={handleCustomerSubmit}
       />
    </div>
  )
}

export default Cart
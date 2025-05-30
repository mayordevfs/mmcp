import { useCart } from '@/stores/cart'
import Image from 'next/image'
import React, { useState } from 'react'
import { EditIcon } from '../icons/edit'
import { formatPrice } from '@/utils/use-price'
import AddCustomerModal from './add-customer-modal'
import { useMutation } from 'react-query'
import axiosInstance from '@/utils/fetch-function'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import useUser from '@/hooks/useUser'

interface CustomerInfoProps{
    contactName: string;
    contactEmail: string;
    contactPhone: string;
}
const Cart = () => {
    const {cart,decrement,increment,getCartTotal,removeItem,clearCart} = useCart()
    const [isModal,setIsModal] = useState(false)
    const user = useUser()
    const [customerData,setCustomerData] =useState<CustomerInfoProps|null>(null)
   
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
                entityId:"101",
                username:user?.username
            }
        }),
        {
            onSuccess: (data) => {
                    // if (data?.data?.code !== '000') {
                    //   toast.error(data?.data?.desc);
                    //   return;
                    // }
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
    <div className='container space-y-3 flex flex-col h-full'>
        {customerData?<div className='flex items-center justify-between p-3 mb-2 shadow-md'>
            <span className='text-[14px] text-center font-medium'>Customer: {customerData?.contactName}</span>
            <button className='w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-white' onClick={()=>setCustomerData(null)}><X size={14}/></button>
        </div>:<button className='flex items-center justify-between p-3 mb-2 shadow-md' onClick={()=>setIsModal(true)}>
            <span>Add customer</span>
            <span className='w-4 h-4 flex items-center justify-center rounded-full bg-blue-700 text-white'>+</span>
        </button>}
        {/* header */}
        <div className='p-3 flex justify-center bg-[#f7f7f7] items-center border-b shadow-md'>
            <h2>Cart Summary</h2>
        </div>
        {/* cart items */}
        <div className='flex-1 h-full overflow-y-auto space-y-3 w-full text-[14px]'>
        {
            cart?.length<1?<div className='w-full h-full flex items-center justify-center'>
                <p>No item in cart</p>
            </div>:cart?.map((item,index)=>(
                <div key={index} className={`flex ${index===cart.length-1&&"border-none"} border-b border-dashed p-3 gap-x-3`}>
                    <div className='w-[40px] h-[40px] flex items-center justify-center bg-[#f7f7f7] rounded-md'>
                        <Image src={item?.picture} alt={'Cart image'} height={56} width={56} className='h-[70%] w-[70%] object-contain '/>
                    </div>
                    <div className='flex-1 space-y-3'>
                        <div className='flex justify-between'>
                            <div>
                            <p className='text-[12px]'>{item?.name?.length!>40?`${item?.name?.slice(0,40)}...`:item?.name}</p>
                            <p className='text-[12px] text-[#9f9f9f] font-bold'>{formatPrice({
                                amount:item?.subTotal,
                                currencyCode:'NGN',
                                locale:'ng'
                            })}</p>
                        </div>
                        <button 

                                className="h-5 w-5 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100"
                                onClick={()=>removeItem(item?.id)}
                                >
                                <span className='text-[13px]'>X</span>
                                </button>
                        </div>
                        <div className='flex justify-between items-center w-full'>
                            <div className='icon-container'>
                                <EditIcon  color='#9f9f9f'/>
                            </div>
                            <div className="bg-gray-50 rounded-full flex justify-between gap-x-1.5 items-center p-1">
                                <button 
                                
                                className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"
                                onClick={()=>{
                                    decrement(item)
                                }}
                                >
                                <span className='text-[13px]'>-</span>
                                </button>
                                <span className="font-medium text-[12px]">{item?.quantity}</span>
                                <button 

                                className="h-5 w-5 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100"
                                onClick={()=>increment(item)}
                                >
                                <span className='text-[13px]'>+</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        }
       </div>
       {/* cart summary */}
      {
        cart?.length>0&& <div className='flex-[0.7] relative border-t border-double flex flex-col'>
            <div className='flex-1 p-3 text-[14px] space-y-1'>
            <div className='flex items-center'>
                <p className='flex-1'>Subtotal</p>
                <div className='flex-[0.4] flex justify-end items-center'>
                    <span>{formatPrice({
                                amount:getCartTotal(),
                                currencyCode:'',
                                locale:''
                            })}</span>
                </div>
            </div>
        </div>
        <div className='flex items-center text-[14px] flex-[0.2] border-t border-dashed p-3'>
                <p className='flex-1 font-bold text-[16px]'>Total</p>
                <div className='flex-[0.4] flex justify-end items-center'>
                    {/* <span className='font-semibold'>₦</span> */}
                    <span>{formatPrice({
                                amount:getCartTotal(),
                                currencyCode:'',
                                locale:''
                            })}</span>
                </div>
            </div>
        <button className='bg-blue-700 text-white font-semibold text-center flex-[0.7] w-full h-full' onClick={submitOrder}>{isLoading?"Please wait":"Place Order"}</button>
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
import { useCart } from '@/stores/cart'
import Image from 'next/image'
import React from 'react'
import { EditIcon } from '../icons/edit'
import { formatPrice } from '@/utils/use-price'

const Cart = () => {
    const {cart,decrement,increment,getCartTotal,removeItem} = useCart()
  return (
    <div className='container space-y-3 flex flex-col h-full'>
        {/* header */}
        <div className='p-3 flex justify-center items-center border-b shadow-md'>
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
                            <p className='text-[14px]'>{item?.name}</p>
                            <p className='text-[14px] text-[#9f9f9f] font-semibold'>{formatPrice({
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
                                <span className="font-medium text-[14px]">{item?.quantity}</span>
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
        <button className='bg-blue-700 text-white font-semibold text-center flex-[0.7] w-full h-full'>Place Order</button>
       </div>
      }
    </div>
  )
}

export default Cart
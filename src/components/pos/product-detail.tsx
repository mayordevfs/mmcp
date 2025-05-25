import React, { useState } from 'react';
import Modal from '../ui/modal/modal';
import Image from 'next/image';
import { formatPrice } from '@/utils/use-price';
import { useCart } from '@/stores/cart';

interface ProductData {
  id?: number;
  name?: string;
  category?: string;
  salePrice?: number;
  description?: string;
  picture?: string;
}

interface ProductDetailProps {
  open?: boolean;
  onClose: () => void;
  data?: any;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ open, onClose, data }) => {
  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  const {addToCart} = useCart()
  // Helper function to format price safely
  const getFormattedPrice = (amount?: number) => {
    if (!amount) return '₦0.00';
    return formatPrice({ 
      amount, 
      currencyCode: 'NGN', 
      locale: 'ng' 
    });
  };
  const closeModal = onClose
  // Calculate total price
  const totalPrice = data?.salePrice ? data.salePrice * quantity : 0;

  const handleAddToCart = () => {
    if (!data) return
    
    // Our store's addToCart function only takes a MenuItem and adds quantity=1
    // Let's modify this to add with the correct quantity
    if (quantity === 1) {
      // If quantity is 1, simply add product directly
      addToCart(data)
    } else {
      // For quantities > 1, we need to add once and then increment
      addToCart(data)
      
      // Now get the cart and increment the item
      const { cart, increment } = useCart.getState()
      const addedItem = cart.find(item => item.id === data.id)
      
      if (addedItem) {
        // Increment to desired quantity (already added 1, so increment quantity-1 times)
        for (let i = 1; i < quantity; i++) {
          increment(addedItem)
        }
      }
    }
    
    // Close modal after adding
    closeModal()
  }

  const content = (
    <div className="w-[max(500px,100%)] max-w-md max-h-screen flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 flex items-center border-b">
          <div className="flex-1 text-center">
            <h2 className="font-semibold text-lg">Menu Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 flex justify-center items-center rounded-full bg-red-50 hover:bg-red-100 transition-colors"
            aria-label="Close modal"
          >
            <span className="text-[#f43f5e]">✕</span>
          </button>
        </div>

        {/* Image */}
        <div className="p-4 bg-gray-50">
          <div className="flex justify-center items-center bg-[#f7f7f7] rounded-lg p-4">
            <Image
              src={"/logo.svg"}
              alt={data?.name || "Menu item"}
              width={200}
              height={200}
              className="object-contain max-h-56"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {data?.category && (
            <div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {data.category}
              </span>
            </div>
          )}
          
          <h2 className="text-xl font-bold">
            {data?.name || "Menu Item"}
          </h2>
          
          {data?.description && (
            <p className="text-sm text-gray-600">
              {data.description}
            </p>
          )}
          
          <p className="text-lg font-bold text-blue-600">
            {getFormattedPrice(data?.salePrice)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 p-2 rounded-full flex justify-between items-center">
            <button 
              onClick={decreaseQuantity}
              className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <span className="text-gray-600">−</span>
            </button>
            <span className="font-medium px-4">{quantity}</span>
            <button 
              onClick={increaseQuantity}
              className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <span className="text-gray-600">+</span>
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          className="p-4 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:bg-gray-400"
          disabled={!data?.salePrice}
          onClick={handleAddToCart}
        >
          Add to Cart - {getFormattedPrice(totalPrice)}
        </button>
      </div>
  );

  // Render with or without Modal wrapper based on open prop
  
    // return <Modal open={open} onClose={closeModal}>
    //     {content}
    // </Modal>
  return <div className='fixed top-0 bottom-0 right-0 left-0 bg-gray-800/50 z-[999] flex justify-center items-center'>
   {content}
  </div>


};

export default ProductDetail;
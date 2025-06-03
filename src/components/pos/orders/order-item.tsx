import { useModalState } from '@/components/ui/modal/modal.context';
import React from 'react';

const OrderItem = () => {
  
  const {data:modalData} = useModalState()

  const calculateSubtotal = () => {
    return modalData?.orderItems?.reduce((sum:any, item:any) => sum + item.amount, 0) || 0;
  };

  const calculateTotalTax = () => {
    return modalData?.orderItems?.reduce((sum:any, item:any) => sum + item.tax, 0) || 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTotalTax();
  };

  return (
    <div className="m-auto w-[800px] rounded bg-white p-8 h-[60vh] overflow-y-auto shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Order Items</h2>
        <div className="w-full h-px bg-blue-300 mb-4"></div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-12 gap-2 mb-4 pb-2 border-b border-gray-300 text-sm font-semibold text-gray-700">
        <div className="col-span-1">No.</div>
        <div className="col-span-5">Product Name</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-2 text-right">Unit Price</div>
        <div className="col-span-2 text-right">Amount</div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-6">
        {modalData?.orderItems?.map((item:any, index:any) => (
          <div key={index} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="col-span-1 text-sm text-gray-600">
              {index + 1}.
            </div>
            <div className="col-span-5">
              <div className="font-medium text-gray-800 leading-tight">
                {item.itemName}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Code: {item.itemCode}
              </div>
            </div>
            <div className="col-span-2 text-center font-medium">
              {item.qty}
            </div>
            <div className="col-span-2 text-right font-medium">
              ₦{item.unitPrice.toFixed(2)}
            </div>
            <div className="col-span-2 text-right font-bold text-blue-600">
              ₦{item.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="border-t-2 border-blue-200 pt-4 mt-6">
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 text-gray-700">
              <span>Subtotal:</span>
              <span className="font-medium">₦{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-gray-700">
              <span>Tax:</span>
              <span className="font-medium">₦{calculateTotalTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold text-blue-600 border-t border-gray-300">
              <span>Total:</span>
              <span>₦{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Thank you for your business!
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Order processed on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
import React from 'react'
import { useModalAction, useModalState } from '../ui/modal/modal.context'
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Hash, 
  MapPin, 
  Receipt, 
  Shield, 
  Upload, 
  User, 
  X,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const SettlementTransactionDetails = () => {
  const {data} = useModalState()
  const {closeModal} = useModalAction()
  
  const formatDate = (dateString:any) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount:any) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusColor = (status:any) => {
    if (!status) return 'text-gray-500';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
      case 'declined':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status:any) => {
    if (!status) return Clock;
    switch (status.toLowerCase()) {
      case 'approved':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
      case 'declined':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const maskCardNumber = (cardNo:any) => {
    if (!cardNo) return 'N/A';
    return cardNo;
  };
  
  const settlementData = data?.settlementTrans;

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="bg-[#0071CE] text-white relative p-6">
        <button 
          onClick={() => closeModal()}
          className="absolute top-4 right-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 rounded-full p-2">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Settlement Transaction Details</h2>
            <p className="text-blue-100">RRN: {settlementData?.rrn}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Transaction Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Transaction Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">RRN</p>
                  <p className="font-semibold text-gray-800 font-mono">{settlementData?.rrn}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">STAN</p>
                  <p className="font-semibold text-gray-800 font-mono">{settlementData?.stan}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Terminal ID</p>
                  <p className="font-semibold text-gray-800 font-mono">{settlementData?.terminalId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Card Number</p>
                  <p className="font-semibold text-gray-800 font-mono text-sm">{maskCardNumber(settlementData?.cardNo)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Financial Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Transaction Amount</p>
                  <p className="font-semibold text-gray-800 text-lg">{formatCurrency(settlementData?.amount)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Charge</p>
                  <p className="font-semibold text-gray-800">{formatCurrency(settlementData?.charge)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Settlement Amount</p>
                  <p className="font-semibold text-gray-800">
                    {settlementData?.settlementAmount ? formatCurrency(settlementData.settlementAmount) : 'Pending'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {React.createElement(getStatusIcon(settlementData?.status), {
                  className: `w-5 h-5 ${getStatusColor(settlementData?.status)}`
                })}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-semibold ${getStatusColor(settlementData?.status)}`}>
                    {settlementData?.status || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Response Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Response Code</p>
                  <p className="font-semibold text-gray-800 font-mono">
                    {settlementData?.responseCode || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Response Message</p>
                  <p className="font-semibold text-gray-800">
                    {settlementData?.responseMessage || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-600">Transaction Reference</p>
                  <p className="font-semibold text-gray-800 font-mono text-sm">
                    {settlementData?.tranRefNo || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm text-gray-600">Match Status</p>
                  <p className="font-semibold text-gray-800">
                    {settlementData?.matchStatus || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Date & File Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Date & File Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Transaction Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(settlementData?.tranDate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Settlement Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(settlementData?.settleDate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">File Type</p>
                  <p className="font-semibold text-gray-800">{settlementData?.fileType}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-600">File Name</p>
                  <p className="font-semibold text-gray-800 font-mono text-sm break-all">
                    {settlementData?.fileName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Upload className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Uploaded Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(settlementData?.uploadedDate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Uploaded By</p>
                  <p className="font-semibold text-gray-800 font-mono">{settlementData?.uploadedBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettlementTransactionDetails;
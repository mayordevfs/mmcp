import React from 'react'
import { useModalAction, useModalState } from '../ui/modal/modal.context'
import { 
  ArrowRightLeft, 
  Banknote, 
  Building2, 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  DollarSign, 
  FileText, 
  Globe, 
  Hash, 
  Link, 
  Mail, 
  MapPin, 
  Phone, 
  Smartphone, 
  Target, 
  User, 
  Users, 
  X,
  AlertCircle,
  Clock,
  TrendingUp,
  LucideIcon
} from 'lucide-react';
import { any } from 'zod';

interface TransferData {
  sendAmount: number | null;
  receiveAmount: number;
  exchRate: number | null;
  sendCountryCode: string | null;
  receiveCountryCode: string | null;
  sendCcy: string;
  receiveCcy: string;
  sendOrReceive: string | null;
  purpose: string | null;
  paymentMode: string | null;
  senderRefNo: string | null;
  paymentRef: string | null;
  senderAccount: string | null;
  senderName: string;
  senderEmail: string | null;
  senderMobile: string | null;
  senderIdLink: string | null;
  receiptLink: string | null;
  beneficiaryAccount: string;
  beneficiaryName: string;
  beneficiaryBankCode: string | null;
  beneficiaryBankName: string | null;
  beneficiaryAccType: string | null;
  geolocation: string | null;
  deviceId: string | null;
  status: string;
  responseMessage: string;
  createdDate: string;
}

interface ModalData {
  transfer_details?: TransferData;
  [key: string]: any;
}

type TransferStatus = 'successful' | 'completed' | 'approved' | 'pending' | 'processing' | 'failed' | 'declined' | 'rejected';

const TransferDetails: React.FC = () => {
  const { data } = useModalState()
  const { closeModal } = useModalAction()
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    // Handle the custom format "13-06-2025 10:17:59 PM"
    try {
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-');
      const formattedDateString = `${month}/${day}/${year} ${timePart}`;
      return new Date(formattedDateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number | null, currency: string = 'NGN'): string => {
    if (amount === null || amount === undefined) return 'N/A';
    
    // Currency mapping for proper formatting
    const currencyMap: Record<string, string> = {
      'MNGN': 'NGN',
      'GBP': 'GBP',
      'USD': 'USD',
      'EUR': 'EUR'
    };
    
    const mappedCurrency = currencyMap[currency] || currency;
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: mappedCurrency
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toLocaleString()}`;
    }
  };

  const getStatusColor = (status: string): string => {
    if (!status) return 'text-gray-500';
    switch (status.toLowerCase() as TransferStatus) {
      case 'successful':
      case 'completed':
      case 'approved':
        return 'text-green-500';
      case 'pending':
      case 'processing':
        return 'text-yellow-500';
      case 'failed':
      case 'declined':
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string): LucideIcon => {
    if (!status) return Clock;
    switch (status.toLowerCase() as TransferStatus) {
      case 'successful':
      case 'completed':
      case 'approved':
        return CheckCircle;
      case 'pending':
      case 'processing':
        return Clock;
      case 'failed':
      case 'declined':
      case 'rejected':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getCurrencyFlag = (currency: string): string => {
    const flags: Record<string, string> = {
      'NGN': '🇳🇬',
      'MNGN': '🇳🇬',
      'GBP': '🇬🇧',
      'USD': '🇺🇸',
      'EUR': '🇪🇺'
    };
    return flags[currency] || '💱';
  };
  
  const transferData: TransferData | undefined = data?.transfer_details || data as TransferData;

  if (!transferData) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="text-center text-gray-500">No transfer data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden">
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
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Transfer Details</h2>
            <p className="text-blue-100">
              {transferData.senderName} → {transferData.beneficiaryName}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Transfer Amount Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Transfer Amount
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Send Amount</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCurrencyFlag(transferData.sendCcy)}</span>
                    <p className="font-semibold text-gray-800 text-lg">
                      {transferData.sendAmount ? 
                        formatCurrency(transferData.sendAmount, transferData.sendCcy) : 
                        'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center py-2">
                <div className="bg-blue-100 rounded-full p-2">
                  <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Banknote className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Receive Amount</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCurrencyFlag(transferData.receiveCcy)}</span>
                    <p className="font-semibold text-gray-800 text-lg">
                      {formatCurrency(transferData.receiveAmount, transferData.receiveCcy)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Exchange Rate</p>
                  <p className="font-semibold text-gray-800">
                    {transferData.exchRate || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Transaction Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Transaction Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {React.createElement(getStatusIcon(transferData.status), {
                  className: `w-5 h-5 ${getStatusColor(transferData.status)}`
                })}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-semibold text-lg ${getStatusColor(transferData.status)}`}>
                    {transferData.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Response Message</p>
                  <p className="font-semibold text-gray-800">
                    {transferData.responseMessage}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Created Date</p>
                  <p className="font-semibold text-gray-800">{formatDate(transferData.createdDate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Purpose</p>
                  <p className="font-semibold text-gray-800">
                    {transferData.purpose || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Payment Mode</p>
                  <p className="font-semibold text-gray-800">
                    {transferData.paymentMode || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Sender Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Sender Name</p>
                  <p className="font-semibold text-gray-800">{transferData.senderName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Sender Account</p>
                  <p className="font-semibold text-gray-800 font-mono">
                    {transferData.senderAccount || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-800 text-sm break-all">
                    {transferData.senderEmail || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="font-semibold text-gray-800 font-mono">
                    {transferData.senderMobile || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-600">Sender Reference</p>
                  <p className="font-semibold text-gray-800 font-mono text-sm">
                    {transferData.senderRefNo || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficiary Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Beneficiary Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Beneficiary Name</p>
                  <p className="font-semibold text-gray-800">{transferData.beneficiaryName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-semibold text-gray-800 font-mono">{transferData.beneficiaryAccount}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-semibold text-gray-800">
                    {transferData.beneficiaryBankName || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Bank Code</p>
                  <p className="font-semibold text-gray-800 font-mono">
                    {transferData.beneficiaryBankCode || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-semibold text-gray-800">
                    {transferData.beneficiaryAccType || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Additional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm text-gray-600">Payment Reference</p>
                  <p className="font-semibold text-gray-800 font-mono text-sm">
                    {transferData.paymentRef || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Device ID</p>
                  <p className="font-semibold text-gray-800 font-mono text-sm">
                    {transferData.deviceId || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Geolocation</p>
                  <p className="font-semibold text-gray-800 font-mono text-xs">
                    {transferData.geolocation || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Send/Receive Type</p>
                  <p className="font-semibold text-gray-800">
                    {transferData.sendOrReceive || 'N/A'}
                  </p>
                </div>
              </div>

              {transferData.senderIdLink && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Link className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Sender ID Link</p>
                    <a 
                      href={transferData.senderIdLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              )}

              {transferData.receiptLink && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Receipt Link</p>
                    <a 
                      href={transferData.receiptLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      Download Receipt
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransferDetails;
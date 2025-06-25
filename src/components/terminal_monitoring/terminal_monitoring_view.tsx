import React from 'react'
import { useModalAction, useModalState } from '../ui/modal/modal.context'
import { Battery, Calendar, MapPin, Package, Printer, Smartphone, Wifi, X, Zap } from 'lucide-react';

const TerminalMonitoringDetails = () => {
  const {data} = useModalState()
  const {closeModal} = useModalAction()
  const formatDate = (dateString:string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBatteryColor = (level:any) => {
    if (level >= 80) return 'text-green-500';
    if (level >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusColor = (status:any) => {
    if (status === 'Paper OK') return 'text-green-500';
    return 'text-red-500';
  };
  
  
  const terminalData = data?.terminal_monitoring
   
   


  return (
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
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
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Terminal Details</h2>
              <p className="text-blue-100">ID: {terminalData?.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Terminal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Terminal Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Terminal ID</p>
                    <p className="font-semibold text-gray-800">{terminalData?.terminalId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 bg-gray-400 rounded text-white text-xs flex items-center justify-center font-bold">
                    S
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Serial Number</p>
                    <p className="font-semibold text-gray-800 font-mono text-sm">{terminalData?.serialNo}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-800">{terminalData?.merchantLocation}</p>
                    <p className="text-xs text-gray-500 font-mono">{terminalData?.geolocation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Device Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Battery className={`w-5 h-5 ${getBatteryColor(terminalData?.batteryStatus)}`} />
                  <div>
                    <p className="text-sm text-gray-600">Battery Level</p>
                    <div className="flex items-center space-x-2">
                      <p className={`font-semibold ${getBatteryColor(terminalData?.batteryStatus)}`}>
                        {terminalData?.batteryStatus}%
                      </p>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            Number(terminalData?.batteryStatus) >= 80 ? 'bg-green-500' :
                            Number(terminalData?.batteryStatus) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${terminalData?.batteryStatus}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Zap className={`w-5 h-5 ${terminalData?.chargeState === 'true' ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm text-gray-600">Charge State</p>
                    <p className={`font-semibold ${terminalData?.chargeState === 'true' ? 'text-green-600' : 'text-gray-600'}`}>
                      {terminalData?.chargeState === 'true' ? 'Charging' : 'Not Charging'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Printer className={`w-5 h-5 ${getStatusColor(terminalData?.printerStatus)}`} />
                  <div>
                    <p className="text-sm text-gray-600">Printer Status</p>
                    <p className={`font-semibold ${getStatusColor(terminalData?.printerStatus)}`}>
                      {terminalData?.printerStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Network Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Wifi className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Network Data</p>
                    <p className="font-semibold text-gray-800">{terminalData?.networkData}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Smartphone className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">SIM Card</p>
                    <p className="font-semibold text-gray-800 font-mono text-xs break-all">{terminalData?.sim}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-bold">
                    C
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cell ID</p>
                    <p className="font-semibold text-gray-800 font-mono text-xs break-all">{terminalData?.cellId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                System Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-600">Last Log Date</p>
                    <p className="font-semibold text-gray-800">{formatDate(terminalData?.logDate)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                    V
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">App Version</p>
                    <p className="font-semibold text-gray-800">{terminalData?.appVersion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
}

export default TerminalMonitoringDetails
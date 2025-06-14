import React from 'react';
import { Banknote } from 'lucide-react';

export const TransferDetailsLoadingState: React.FC = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
      <Banknote className="h-5 w-5" />
      Transfer Details
    </h3>
    <div className="text-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading exchange rates...</p>
    </div>
  </div>
);
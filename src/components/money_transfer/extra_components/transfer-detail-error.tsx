import React from 'react';
import { Banknote } from 'lucide-react';

export const TransferDetailsErrorState: React.FC = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
      <Banknote className="h-5 w-5" />
      Transfer Details
    </h3>
    <div className="text-center py-4">
      <p className="text-red-600">Error loading exchange rates. Please try again.</p>
    </div>
  </div>
);
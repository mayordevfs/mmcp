import { DownloadIcon } from "@/components/icons/download-icon";
import { PlusIcon } from "@/components/icons/plus-icon";

export default function OrderStatusNav() {
  const tabs = [
    { label: "All Orders", active: true },
    { label: "Drafts", active: false },
    { label: "Canceled", active: false },
    { label: "Shipping", active: false },
    { label: "Completed", active: false }
  ];

  return (
    <div className="bg-white border-b border-gray-200 mt-3 w-full rounded-md">
      <div className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
          {/* Left side - Navigation tabs */}
          <div className="flex overflow-x-auto">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                    tab.active
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 min-w-max">
            <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export as CSV
            </button>
            
            <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
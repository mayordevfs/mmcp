import { FilterIcon } from "@/components/icons/filter-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { DatePicker } from "@/components/ui/date-picker";
import Input from "@/components/ui/input";


export default function SearchFilterBar() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-3 py-4 lg:flex-row lg:items-center">
          {/* Search input */}
          {/* <div className="flex-1 relative">
            <div className="my-auto  left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div> */}
          {/* <Input
            name="search"
            placeholder="Search..."
          /> */}

          {/* Filter and Date buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 min-w-max lg:flex-row lg:items-center">
            <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filter
            </button>
            
            <DatePicker placeholderText="start"/>-<DatePicker placeholderText="end"/>
          </div>
        </div>
      </div>
    </div>
  );
}
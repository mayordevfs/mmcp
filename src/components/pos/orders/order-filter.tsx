import { FilterIcon } from "@/components/icons/filter-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import Button from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import Input from "@/components/ui/input";

type SearchFilterBarProps = {
  filter: {
    startDate: any;
    endDate: any;
    orderNo: string;
    customerId: string;
  };
  onDateChange: (date: Date | null, name: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function SearchFilterBar({
  filter,
  onDateChange,
  onInputChange,
  onSubmit,
}: SearchFilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6">
        <div className="flex flex-col gap-3 py-4">
         
          {/* Filter and Date buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 min-w-max lg:flex-row lg:items-center">
            <DatePicker 
            placeholderText="start"
            onChange={(date) => onDateChange(date, 'startDate')}
            value={filter.startDate}
            />-
            
            <DatePicker 
            placeholderText="end"
            onChange={(date) => onDateChange(date, 'endDate')}
            value={filter.endDate}
            />
          </div>
          <div>
            <Input
            name="orderNo"
            placeholder="Order No"
            inputClassName="w-64"
            onChange={onInputChange}
            value={filter.orderNo}
          />
          </div>
        </div>
        <Button className="w-30 mb-4" onClick={onSubmit}>Filter</Button>
      </div>
    </div>
  );
}
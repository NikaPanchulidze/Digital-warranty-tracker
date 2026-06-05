import { Search } from 'lucide-react';

import { Card, Input, Select } from '@/app/components/ui';
import type { WarrantyStatus } from '@/shared/types/domain';

type ProductFiltersProps = {
  categories: string[];
  searchTerm: string;
  category: string;
  status: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: WarrantyStatus | '') => void;
  onSortChange: (value: string) => void;
};

export function ProductFilters({
  categories,
  searchTerm,
  category,
  status,
  sort,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <Card className="p-4 flex w-full flex-col gap-4 lg:w-fit lg:max-w-full lg:flex-row">
      <div className="relative flex-1 lg:hidden">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search products by name, brand, or serial..."
          className="pl-10"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
        <Select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(event) => onStatusChange(event.target.value as WarrantyStatus | '')}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="expiring">Expiring Soon</option>
          <option value="expired">Expired</option>
          <option value="unknown">Unknown</option>
        </Select>
        <Select value={sort} onChange={(event) => onSortChange(event.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price_asc">Price low to high</option>
          <option value="price_desc">Price high to low</option>
          <option value="warranty_asc">Warranty end ascending</option>
          <option value="warranty_desc">Warranty end descending</option>
        </Select>
      </div>
    </Card>
  );
}

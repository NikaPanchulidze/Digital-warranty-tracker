import { Card, Input, Label, Select, Textarea } from '@/app/components/ui';
import type { ProductInput } from '@/shared/types/domain';

type ProductFormProps = {
  form: ProductInput;
  errors?: Partial<Record<keyof ProductInput, string>>;
  onFieldChange: (field: keyof ProductInput, value: string) => void;
};

export function ProductForm({ form, errors = {}, onFieldChange }: ProductFormProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input id="name" required value={form.name} onChange={(event) => onFieldChange('name', event.target.value)} placeholder="e.g. MacBook Pro 16-inch 2023" aria-invalid={Boolean(errors.name)} />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select id="category" value={form.category ?? ''} onChange={(event) => onFieldChange('category', event.target.value)}>
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Appliances">Appliances</option>
            <option value="Furniture">Furniture</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Tools">Tools</option>
            <option value="Other">Other</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" value={form.brand ?? ''} onChange={(event) => onFieldChange('brand', event.target.value)} placeholder="e.g. Apple" />
        </div>

        <div>
          <Label htmlFor="price">Purchase Price ($)</Label>
          <Input id="price" type="number" step="0.01" min="0" value={form.price ?? ''} onChange={(event) => onFieldChange('price', event.target.value)} placeholder="0.00" aria-invalid={Boolean(errors.price)} />
          {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div>
          <Label htmlFor="purchaseDate">Purchase Date *</Label>
          <Input id="purchaseDate" type="date" required value={form.purchase_date} onChange={(event) => onFieldChange('purchase_date', event.target.value)} aria-invalid={Boolean(errors.purchase_date)} />
          {errors.purchase_date && <p className="mt-2 text-sm text-red-600">{errors.purchase_date}</p>}
        </div>

        <div>
          <Label htmlFor="serialNumber">Serial / Model Number</Label>
          <Input id="serialNumber" value={form.serial_number ?? ''} onChange={(event) => onFieldChange('serial_number', event.target.value)} placeholder="Enter serial number" />
        </div>

        <div>
          <Label htmlFor="warrantyMonths">Warranty Duration (Months) *</Label>
          <Input id="warrantyMonths" type="number" min="0" required value={form.warranty_months} onChange={(event) => onFieldChange('warranty_months', event.target.value)} placeholder="12" aria-invalid={Boolean(errors.warranty_months)} />
          {errors.warranty_months && <p className="mt-2 text-sm text-red-600">{errors.warranty_months}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea id="notes" rows={3} value={form.notes ?? ''} onChange={(event) => onFieldChange('notes', event.target.value)} placeholder="Any specific details, conditions, or retailer information..." />
        </div>
      </div>
    </Card>
  );
}

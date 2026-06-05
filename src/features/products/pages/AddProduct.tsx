import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, Card, LoadingBlock, Spinner } from '@/app/components/ui';
import { ProductForm } from '@/features/products/components/ProductForm';
import { getProduct, saveProduct } from '@/features/products/api/productsApi';
import { api } from '@/shared/api/backendApi';
import type { ProductInput } from '@/shared/types/domain';

const initialForm: ProductInput = {
  name: '',
  brand: '',
  category: '',
  purchase_date: '',
  price: null,
  warranty_months: 12,
  serial_number: '',
  notes: '',
};

type ProductFormErrors = Partial<Record<keyof ProductInput, string>>;

export function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<ProductInput>(initialForm);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ProductFormErrors>({});

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name,
      brand: product.brand ?? '',
      category: product.category ?? '',
      purchase_date: product.purchase_date ?? '',
      price: product.price,
      warranty_months: product.warranty_months ?? 12,
      serial_number: product.serial_number ?? '',
      notes: product.notes ?? '',
      image_path: product.image_path,
    });
  }, [product]);

  const mutation = useMutation({
    mutationFn: () => saveProduct(form, id),
    onSuccess: async (saved) => {
      try {
        await api.post('/notifications/run-check');
      } catch {
        // Product saving should not fail just because reminder generation is unavailable.
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['product', saved.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      navigate(`/products/${saved.id}`);
    },
    onError: (err) => setError(getProductSaveErrorMessage(err)),
  });

  const updateField = (field: keyof ProductInput, value: string) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError('');
    setForm((current) => ({
      ...current,
      [field]: field === 'price' ? (value === '' ? null : Number(value)) : field === 'warranty_months' ? Number(value) : value,
    }));
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const validationErrors = validateProductForm(form);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the highlighted fields before saving.');
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/products')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-gray-500 mt-1">Enter product details and warranty information</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="space-y-6">
          {isEditing && isProductLoading ? (
            <LoadingBlock label="Loading product details..." />
          ) : (
            <ProductForm form={form} errors={fieldErrors} onFieldChange={updateField} />
          )}
          {error && <Card className="p-4 border-red-100 bg-red-50 text-sm text-red-700">{error}</Card>}
          <div className="flex items-center justify-end gap-4 pb-12">
            <Button variant="secondary" type="button" onClick={() => navigate('/products')}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending || (isEditing && isProductLoading)} className="gap-2">
              {mutation.isPending && <Spinner />}
              {mutation.isPending ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function validateProductForm(form: ProductInput) {
  const errors: ProductFormErrors = {};
  const productName = form.name.trim();

  if (!productName) {
    errors.name = 'Product name is required.';
  } else if (productName.length < 2) {
    errors.name = 'Product name must be at least 2 characters.';
  }

  if (!form.purchase_date) {
    errors.purchase_date = 'Purchase date is required.';
  }

  if (!Number.isFinite(Number(form.warranty_months)) || Number(form.warranty_months) < 0) {
    errors.warranty_months = 'Warranty duration must be 0 months or more.';
  }

  if (form.price != null && (!Number.isFinite(Number(form.price)) || Number(form.price) < 0)) {
    errors.price = 'Purchase price must be 0 or more.';
  }

  return errors;
}

function getProductSaveErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : '';

  if (message.includes('products_name_check')) {
    return 'Product name must be at least 2 characters.';
  }

  if (message.includes('products_price_check')) {
    return 'Purchase price must be 0 or more.';
  }

  if (message.includes('products_warranty_months_check')) {
    return 'Warranty duration must be 0 months or more.';
  }

  if (message.toLowerCase().includes('row-level security')) {
    return 'You do not have permission to save this product.';
  }

  return message || 'Unable to save product. Please check the form and try again.';
}

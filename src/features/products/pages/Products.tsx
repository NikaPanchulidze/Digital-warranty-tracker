import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Download, Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button, Card } from '@/app/components/ui';
import { api } from '@/shared/api/backendApi';
import type { WarrantyStatus } from '@/shared/types/domain';
import { deleteProduct, listProducts } from '@/features/products/api/productsApi';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { ProductTable } from '@/features/products/components/ProductTable';

const PRODUCTS_PAGE_SIZE = 10;

export function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<WarrantyStatus | ''>('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const filters = useMemo(() => ({ search: searchTerm, category, status, sort }), [category, searchTerm, sort, status]);
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products', 'all-categories'],
    queryFn: () => listProducts(),
  });
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => listProducts(filters),
  });
  const categories = useMemo(
    () => Array.from(new Set(allProducts.map((product) => product.category).filter(Boolean))).sort() as string[],
    [allProducts],
  );
  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PAGE_SIZE));
  const paginatedProducts = products.slice((page - 1) * PRODUCTS_PAGE_SIZE, page * PRODUCTS_PAGE_SIZE);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });

  const exportCsv = async () => {
    const response = await api.get('/export/products.csv', { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setSearchTerm(searchParams.get('search') ?? '');
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const updateSearchTerm = (value: string) => {
    setSearchTerm(value);

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      const trimmedValue = value.trim();

      if (trimmedValue) {
        nextParams.set('search', trimmedValue);
      } else {
        nextParams.delete('search');
      }

      return nextParams;
    }, { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage all your products and warranties</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={exportCsv} className="w-full sm:w-auto gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={() => navigate('/products/add')} className="w-full sm:w-auto gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      <ProductFilters
        categories={categories}
        searchTerm={searchTerm}
        category={category}
        status={status}
        sort={sort}
        onSearchChange={updateSearchTerm}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onSortChange={setSort}
      />

      {error && (
        <Card className="p-4 border-red-100 bg-red-50 text-sm text-red-700">
          Unable to load products. Check Supabase configuration and RLS policies.
        </Card>
      )}

      <ProductTable
        products={paginatedProducts}
        isLoading={isLoading}
        page={page}
        pageSize={PRODUCTS_PAGE_SIZE}
        totalItems={products.length}
        onPageChange={setPage}
        onView={(productId) => navigate(`/products/${productId}`)}
        onEdit={(productId) => navigate(`/products/${productId}/edit`)}
        onDelete={(productId) => deleteMutation.mutate(productId)}
      />
    </div>
  );
}

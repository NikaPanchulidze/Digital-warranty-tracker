import { useEffect, useState } from 'react';
import { Package, DollarSign, ShieldCheck, AlertTriangle, XOctagon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { Card } from '@/app/components/ui';
import { api } from '@/shared/api/backendApi';
import type { DashboardAnalytics } from '@/shared/types/domain';
import { formatMoney } from '@/shared/lib/warranty';
import { AssetValueCard } from '@/features/dashboard/components/AssetValueCard';
import { ExpiringSoonTable } from '@/features/dashboard/components/ExpiringSoonTable';
import { ProductsByCategoryCard } from '@/features/dashboard/components/ProductsByCategoryCard';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard';
import { WarrantyStatusCard } from '@/features/dashboard/components/WarrantyStatusCard';

const EXPIRING_SOON_PAGE_SIZE = 5;

const emptyAnalytics: DashboardAnalytics = {
  totalProducts: 0,
  totalAssetValue: 0,
  activeWarrantyCount: 0,
  expiringSoonCount: 0,
  expiredWarrantyCount: 0,
  productsByCategory: [],
  assetValueByCategory: [],
  warrantyStatusDistribution: [],
  expiringSoonProducts: [],
};

export function Dashboard() {
  const navigate = useNavigate();
  const [expiringSoonPage, setExpiringSoonPage] = useState(1);
  const { data = emptyAnalytics, isLoading, error } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => (await api.get<DashboardAnalytics>('/analytics/dashboard')).data,
  });

  const expiringSoonTotalPages = Math.max(1, Math.ceil(data.expiringSoonProducts.length / EXPIRING_SOON_PAGE_SIZE));
  const paginatedExpiringSoonProducts = data.expiringSoonProducts.slice(
    (expiringSoonPage - 1) * EXPIRING_SOON_PAGE_SIZE,
    expiringSoonPage * EXPIRING_SOON_PAGE_SIZE,
  );

  useEffect(() => {
    if (expiringSoonPage > expiringSoonTotalPages) {
      setExpiringSoonPage(expiringSoonTotalPages);
    }
  }, [expiringSoonPage, expiringSoonTotalPages]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your products and warranties</p>
      </div>

      {error && (
        <Card className="p-4 border-red-100 bg-red-50 text-sm text-red-700">
          Backend analytics are unavailable. Start the backend server and confirm `VITE_API_URL`.
        </Card>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        <SummaryCard label="Total Products" value={data.totalProducts} helper="Owned products" icon={<Package className="w-5 h-5" />} color="blue" isLoading={isLoading} />
        <SummaryCard label="Total Asset Value" value={formatMoney(data.totalAssetValue)} helper="Across all categories" icon={<DollarSign className="w-5 h-5" />} color="green" isLoading={isLoading} />
        <SummaryCard label="Active Warranties" value={data.activeWarrantyCount} helper="More than 30 days left" icon={<ShieldCheck className="w-5 h-5" />} color="green" isLoading={isLoading} />
        <SummaryCard label="Expiring Soon" value={data.expiringSoonCount} helper="Within next 30 days" icon={<AlertTriangle className="w-5 h-5" />} color="yellow" isLoading={isLoading} />
        <SummaryCard label="Expired" value={data.expiredWarrantyCount} helper="Warranties ended" icon={<XOctagon className="w-5 h-5" />} color="red" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        <ProductsByCategoryCard data={data.productsByCategory} isLoading={isLoading} onAddProduct={() => navigate('/products/add')} />
        <WarrantyStatusCard data={data.warrantyStatusDistribution} isLoading={isLoading} onAddProduct={() => navigate('/products/add')} />
        <AssetValueCard data={data.assetValueByCategory} isLoading={isLoading} onAddProduct={() => navigate('/products/add')} />
      </div>

      <ExpiringSoonTable
        products={paginatedExpiringSoonProducts}
        isLoading={isLoading}
        page={expiringSoonPage}
        pageSize={EXPIRING_SOON_PAGE_SIZE}
        totalItems={data.expiringSoonProducts.length}
        onPageChange={setExpiringSoonPage}
        onViewAll={() => navigate('/products')}
        onViewProduct={(id) => navigate(`/products/${id}`)}
      />
    </div>
  );
}

import { useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Card, LoadingBlock } from '@/app/components/ui';
import {
  addMaintenance,
  deleteDocument,
  deleteMaintenance,
  deleteProduct,
  downloadDocument,
  getProduct,
  listDocuments,
  listMaintenance,
  uploadDocument,
} from '@/features/products/api/productsApi';
import { MaintenanceHistory } from '@/features/products/components/MaintenanceHistory';
import { ProductDetailsCard } from '@/features/products/components/ProductDetailsCard';
import { ProductDocuments } from '@/features/products/components/ProductDocuments';
import { ProductHeader } from '@/features/products/components/ProductHeader';
import { WarrantyStatusPanel } from '@/features/products/components/WarrantyStatusPanel';
import { api } from '@/shared/api/backendApi';
import { calculateDaysLeft, getWarrantyStatus } from '@/shared/lib/warranty';
import type { ProductDocument } from '@/shared/types/domain';

export function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<ProductDocument['document_type']>('receipt');
  const [maintenanceForm, setMaintenanceForm] = useState({ date: '', description: '', cost: '', service_provider: '', next_reminder_date: '' });

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [id]);

  const { data: product, isLoading } = useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id!), enabled: Boolean(id) });
  const { data: documents = [], isLoading: areDocumentsLoading } = useQuery({ queryKey: ['documents', id], queryFn: () => listDocuments(id!), enabled: Boolean(id) });
  const { data: maintenance = [], isLoading: isMaintenanceLoading } = useQuery({ queryKey: ['maintenance', id], queryFn: () => listMaintenance(id!), enabled: Boolean(id) });

  const uploadMutation = useMutation({
    mutationFn: () => uploadDocument(id!, selectedFile!, documentType),
    onSuccess: () => {
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['documents', id] });
    },
  });

  const addMaintenanceMutation = useMutation({
    mutationFn: () => addMaintenance(id!, {
      date: maintenanceForm.date,
      description: maintenanceForm.description,
      cost: maintenanceForm.cost ? Number(maintenanceForm.cost) : null,
      service_provider: maintenanceForm.service_provider || null,
      next_reminder_date: maintenanceForm.next_reminder_date || null,
    }),
    onSuccess: async () => {
      setMaintenanceForm({ date: '', description: '', cost: '', service_provider: '', next_reminder_date: '' });
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
      await api.post('/notifications/run-check').catch(() => undefined);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['documents', id] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
      navigate('/products');
    },
  });

  const totalMaintenanceCost = useMemo(() => maintenance.reduce((sum, record) => sum + Number(record.cost ?? 0), 0), [maintenance]);

  if (isLoading) return <LoadingBlock label="Loading product..." />;
  if (!product) return <Card className="p-8 text-center text-gray-500">Product not found.</Card>;

  const productStatus = getWarrantyStatus(product);
  const daysRemaining = calculateDaysLeft(product.warranty_end_date);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <ProductHeader
        product={product}
        status={productStatus}
        onBack={() => navigate('/products')}
        onEdit={() => navigate(`/products/${product.id}/edit`)}
        onDelete={() => deleteProductMutation.mutate()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProductDetailsCard product={product} />
          <ProductDocuments
            documents={documents}
            isLoading={areDocumentsLoading}
            selectedFile={selectedFile}
            documentType={documentType}
            isUploading={uploadMutation.isPending}
            onFileChange={setSelectedFile}
            onDocumentTypeChange={setDocumentType}
            onUpload={() => uploadMutation.mutate()}
            onDownload={downloadDocument}
            onDelete={async (document) => {
              await deleteDocument(document);
              queryClient.invalidateQueries({ queryKey: ['documents', id] });
            }}
          />
          <MaintenanceHistory
            maintenance={maintenance}
            isLoading={isMaintenanceLoading}
            form={maintenanceForm}
            totalCost={totalMaintenanceCost}
            isAdding={addMaintenanceMutation.isPending}
            onFormChange={setMaintenanceForm}
            onAdd={() => addMaintenanceMutation.mutate()}
            onDelete={async (maintenanceId) => {
              await deleteMaintenance(maintenanceId);
              queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
            }}
          />
        </div>

        <WarrantyStatusPanel product={product} daysRemaining={daysRemaining} />
      </div>
    </div>
  );
}

import { DOCUMENT_BUCKET, supabase } from '@/shared/api/supabase';
import { addMonths, getWarrantyStatus } from '@/shared/lib/warranty';
import type { MaintenanceRecord, Product, ProductDocument, ProductInput, WarrantyStatus } from '@/shared/types/domain';

export type ProductFilters = {
  search?: string;
  category?: string;
  status?: WarrantyStatus | '';
  sort?: string;
};

export async function listProducts(filters: ProductFilters = {}) {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false });

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,serial_number.ilike.%${filters.search}%`);
  }
  if (filters.category) query = query.eq('category', filters.category);

  const { data, error } = await query;
  if (error) throw error;

  let products = (data ?? []) as Product[];
  if (filters.status) {
    products = products.filter((product) => getWarrantyStatus(product) === filters.status);
  }

  return sortProducts(products, filters.sort);
}

export async function getProduct(id: string) {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Product;
}

export async function saveProduct(input: ProductInput, id?: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('You must be signed in to save a product.');

  const payload = {
    ...input,
    user_id: userId,
    warranty_end_date: addMonths(input.purchase_date, input.warranty_months),
    updated_at: new Date().toISOString(),
  };

  const result = id
    ? await supabase.from('products').update(payload).eq('id', id).select('*').single()
    : await supabase.from('products').insert(payload).select('*').single();

  if (result.error) throw result.error;
  return result.data as Product;
}

export async function deleteProduct(id: string) {
  const { data: documents, error: documentsError } = await supabase
    .from('documents')
    .select('storage_path')
    .eq('product_id', id);
  if (documentsError) throw documentsError;

  const storagePaths = (documents ?? [])
    .map((document) => document.storage_path)
    .filter(Boolean);

  if (storagePaths.length) {
    const remove = await supabase.storage.from(DOCUMENT_BUCKET).remove(storagePaths);
    if (remove.error) throw remove.error;
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function listDocuments(productId: string) {
  const { data, error } = await supabase.from('documents').select('*').eq('product_id', productId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProductDocument[];
}

export async function uploadDocument(productId: string, file: File, documentType: ProductDocument['document_type']) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('You must be signed in to upload documents.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const storagePath = `${userId}/${productId}/${crypto.randomUUID()}-${safeName}`;
  const upload = await supabase.storage.from(DOCUMENT_BUCKET).upload(storagePath, file);
  if (upload.error) throw upload.error;

  const { data, error } = await supabase.from('documents').insert({
    product_id: productId,
    user_id: userId,
    original_name: file.name,
    storage_path: storagePath,
    mime_type: file.type,
    size: file.size,
    document_type: documentType,
  }).select('*').single();
  if (error) throw error;
  return data as ProductDocument;
}

export async function downloadDocument(doc: ProductDocument) {
  const { data, error } = await supabase.storage.from(DOCUMENT_BUCKET).createSignedUrl(doc.storage_path, 60);
  if (error) throw error;
  window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
}

export async function deleteDocument(doc: ProductDocument) {
  const remove = await supabase.storage.from(DOCUMENT_BUCKET).remove([doc.storage_path]);
  if (remove.error) throw remove.error;
  const { error } = await supabase.from('documents').delete().eq('id', doc.id);
  if (error) throw error;
}

export async function listMaintenance(productId: string) {
  const { data, error } = await supabase.from('maintenance_records').select('*').eq('product_id', productId).order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as MaintenanceRecord[];
}

export async function addMaintenance(productId: string, input: Pick<MaintenanceRecord, 'date' | 'description' | 'cost' | 'service_provider' | 'next_reminder_date'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error('You must be signed in to add maintenance records.');

  const { data, error } = await supabase.from('maintenance_records').insert({
    ...input,
    product_id: productId,
    user_id: userId,
  }).select('*').single();
  if (error) throw error;
  return data as MaintenanceRecord;
}

export async function deleteMaintenance(id: string) {
  const { error } = await supabase.from('maintenance_records').delete().eq('id', id);
  if (error) throw error;
}

function sortProducts(products: Product[], sort?: string) {
  const copy = [...products];
  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => a.created_at.localeCompare(b.created_at));
    case 'price_asc':
      return copy.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'price_desc':
      return copy.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'warranty_asc':
      return copy.sort((a, b) => (a.warranty_end_date ?? '').localeCompare(b.warranty_end_date ?? ''));
    case 'warranty_desc':
      return copy.sort((a, b) => (b.warranty_end_date ?? '').localeCompare(a.warranty_end_date ?? ''));
    default:
      return copy.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
}

export type WarrantyStatus = 'active' | 'expiring' | 'expired' | 'unknown';

export type Product = {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  category: string | null;
  purchase_date: string | null;
  price: number | null;
  warranty_months: number | null;
  warranty_end_date: string | null;
  serial_number: string | null;
  notes: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductInput = {
  name: string;
  brand?: string | null;
  category?: string | null;
  purchase_date: string;
  price?: number | null;
  warranty_months: number;
  serial_number?: string | null;
  notes?: string | null;
  image_path?: string | null;
};

export type ProductDocument = {
  id: string;
  product_id: string;
  user_id: string;
  original_name: string;
  storage_path: string;
  mime_type: string | null;
  size: number | null;
  document_type: 'receipt' | 'warranty_card' | 'manual' | 'other';
  created_at: string;
};

export type MaintenanceRecord = {
  id: string;
  product_id: string;
  user_id: string;
  date: string;
  description: string;
  cost: number | null;
  service_provider: string | null;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  product_id: string | null;
  type: 'in_app' | 'email';
  threshold_days: number | null;
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  is_read: boolean;
  sent_at: string | null;
  created_at: string;
};

export type NotificationSettings = {
  user_id: string;
  email_reminders_enabled: boolean;
  thresholds: number[];
  weekly_summary_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type DashboardAnalytics = {
  totalProducts: number;
  totalAssetValue: number;
  activeWarrantyCount: number;
  expiringSoonCount: number;
  expiredWarrantyCount: number;
  productsByCategory: Array<{ name: string; value: number }>;
  assetValueByCategory: Array<{ name: string; value: number }>;
  warrantyStatusDistribution: Array<{ name: string; value: number }>;
  expiringSoonProducts: Array<Product & { daysLeft: number; warrantyStatus: WarrantyStatus }>;
};

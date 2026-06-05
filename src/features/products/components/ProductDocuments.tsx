import { Download, FileText, Trash2, UploadCloud } from 'lucide-react';

import { Button, Card, Input, Select, Skeleton, Spinner } from '@/app/components/ui';
import type { ProductDocument } from '@/shared/types/domain';
import { formatDate } from '@/shared/lib/warranty';

type ProductDocumentsProps = {
  documents: ProductDocument[];
  isLoading?: boolean;
  selectedFile: File | null;
  documentType: ProductDocument['document_type'];
  isUploading: boolean;
  onFileChange: (file: File | null) => void;
  onDocumentTypeChange: (documentType: ProductDocument['document_type']) => void;
  onUpload: () => void;
  onDownload: (document: ProductDocument) => void;
  onDelete: (document: ProductDocument) => void;
};

export function ProductDocuments({
  documents,
  isLoading,
  selectedFile,
  documentType,
  isUploading,
  onFileChange,
  onDocumentTypeChange,
  onUpload,
  onDownload,
  onDelete,
}: ProductDocumentsProps) {
  return (
    <Card>
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-3">
          <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
          <Select value={documentType} onChange={(event) => onDocumentTypeChange(event.target.value as ProductDocument['document_type'])}>
            <option value="receipt">Receipt</option>
            <option value="warranty_card">Warranty Card</option>
            <option value="manual">Manual</option>
            <option value="other">Other</option>
          </Select>
          <Button type="button" className="gap-2" disabled={!selectedFile || isUploading} onClick={onUpload}>
            {isUploading ? <Spinner /> : <UploadCloud className="w-4 h-4" />}
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {isLoading && <DocumentsSkeleton />}
        {!isLoading && documents.map((document) => (
          <div key={document.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{document.original_name}</p>
                <p className="text-xs text-gray-500">
                  {document.document_type.replace('_', ' ')} - {Math.round((document.size ?? 0) / 1024)} KB - Uploaded {formatDate(document.created_at.slice(0, 10))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="p-2 h-auto text-gray-500 hover:text-blue-600" onClick={() => onDownload(document)}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="p-2 h-auto text-gray-500 hover:text-red-600" onClick={() => onDelete(document)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {!isLoading && !documents.length && <div className="p-8 text-center text-gray-500">No documents uploaded yet.</div>}
      </div>
    </Card>
  );
}

function DocumentsSkeleton() {
  return (
    <>
      {[0, 1].map((row) => (
        <div key={row} className="p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-4 w-44" />
              <Skeleton className="mt-2 h-3 w-64" />
            </div>
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </>
  );
}

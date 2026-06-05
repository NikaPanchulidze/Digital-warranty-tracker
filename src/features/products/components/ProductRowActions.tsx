import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';

type ProductRowActionsProps = {
  productId: string;
  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
};

export function ProductRowActions({ productId, onView, onEdit, onDelete }: ProductRowActionsProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
          <MoreVertical className="w-5 h-5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-50 hover:text-blue-600 rounded-md cursor-pointer"
            onClick={() => onView(productId)}
          >
            <Eye className="w-4 h-4" /> View Details
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-50 hover:text-blue-600 rounded-md cursor-pointer"
            onClick={() => onEdit(productId)}
          >
            <Edit className="w-4 h-4" /> Edit Product
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-gray-100 my-1" />
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50 rounded-md cursor-pointer"
            onClick={() => onDelete(productId)}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

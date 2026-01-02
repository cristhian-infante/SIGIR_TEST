import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Category } from '../../Index';

export function useCategoryActions(dataCategories: Category[]) {
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [selectedRows, setSelectedRows] = useState<Category[]>([]);

    const handleRowSelectionChange = (updaterOrValue: any) => {
        const nextSelection = typeof updaterOrValue === 'function' 
            ? updaterOrValue(rowSelection) 
            : updaterOrValue;
        
        setRowSelection(nextSelection);
        const selectedIds = Object.keys(nextSelection).filter(id => nextSelection[id]);
        setSelectedRows(dataCategories.filter(cat => selectedIds.includes(String(cat.id))));
    };

    const resetSelection = () => {
        setRowSelection({});
        setSelectedRows([]);
    };

    const bulkDelete = () => {
        router.post('/category/bulk-delete', { 
            ids: selectedRows.map(r => r.id) 
        }, {
            preserveState: true,
            onSuccess: resetSelection,
        });
    };

    const bulkStatus = (status: boolean) => {
        router.post('/category/bulk-status', { 
            ids: selectedRows.map(r => r.id),
            status 
        }, {
            preserveState: true,
            onSuccess: resetSelection,
        });
    };

    return {
        rowSelection,
        selectedRows,
        handleRowSelectionChange,
        bulkDelete,
        bulkStatus,
    };
}
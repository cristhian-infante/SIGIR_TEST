import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Category } from '../Index';

interface BulkActionsProps {
    selectedRows: Category[];
    onStatusChange: (status: boolean) => void;
    onDeleteClick: () => void;
}

export function BulkActions({ selectedRows, onStatusChange, onDeleteClick }: BulkActionsProps) {
    if (selectedRows.length === 0) return null;

    const estados = selectedRows.map(r => r.estado?.toLowerCase().trim());
    const todosActivos = estados.every(e => e === 'activo');
    const todosInactivos = estados.every(e => e === 'inactivo');

    return (
        <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
            {todosActivos && (
                <Button variant="outline" size="sm" className="text-orange-600 bg-orange-50 border-orange-200" onClick={() => onStatusChange(false)}>
                    <XCircle className="mr-2 h-4 w-4" /> Desactivar ({selectedRows.length})
                </Button>
            )}
            {todosInactivos && (
                <Button variant="outline" size="sm" className="text-emerald-600 bg-emerald-50 border-emerald-200" onClick={() => onStatusChange(true)}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Activar ({selectedRows.length})
                </Button>
            )}
            <Button variant="destructive" size="sm" onClick={onDeleteClick}>
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar ({selectedRows.length})
            </Button>
        </div>
    );
}
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { ActionsCellDelete } from './actionsDelete';
import { Categoria } from './Columns';

export const columnsDelete: ColumnDef<Categoria>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="border-zinc-700 data-[state=checked]:bg-zinc-800 data-[state=checked]:border-zinc-600"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'codigo',
        header: 'Código',
        cell: ({ row }) => (
            <code className="rounded border border-slate-700 bg-slate-800 p-1.5 font-mono text-xs font-bold text-blue-400">
                {row.getValue('codigo')}
            </code>
        ),
    },
    {
        accessorKey: 'nombre',
        header: 'Categoría Eliminada',
        cell: ({ row }) => (
            <span className="font-medium text-slate-400 line-through opacity-70">
                {row.getValue('nombre')}
            </span>
        ),
    },
    {
        accessorKey: 'deleted_at',
        header: 'Fecha de Eliminación',
        cell: ({ row }) => {
            const date = new Date(row.getValue('deleted_at'));
            return (
                <div className="flex items-center gap-2 text-xs font-medium text-rose-500/90">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {date.toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => (
            <div className="text-right">Acciones de Recuperación</div>
        ),
        cell: ({ row }) => <ActionsCellDelete categoria={row.original} />,
    },
];

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, BadgeCheckIcon, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import { ActionsCell } from './Actions'; 
import { Category } from '../../Index';

export const Columns: ColumnDef<Category>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'codigo',
        header: 'Código',
        cell: ({ row }) => (
            <code className="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold">
                {row.getValue('codigo')}
            </code>
        ),
    },
    {
        accessorKey: 'nombre',
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium px-4">{row.getValue('nombre')}</div>,
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const isActivo = (row.getValue('estado') as string).toLowerCase() === 'activo';
            return (
                <Badge variant="outline" className={cn(
                    'gap-1.5 px-2.5 py-0.5 font-semibold',
                    isActivo ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-400 bg-slate-50 text-slate-600'
                )}>
                    {isActivo ? <BadgeCheckIcon className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    <span className="capitalize">{row.getValue('estado')}</span>
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsCell categoria={row.original} />,
    },
];
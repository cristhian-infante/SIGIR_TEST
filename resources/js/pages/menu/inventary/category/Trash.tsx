'use client';

import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { DataTable } from '../../../../components/ui/datatable';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { columnsDelete } from './components/tables/ColumnsDelete';
import { toast } from 'sonner';
import category from '@/routes/category';
import { dashboard } from '@/routes';

interface TrashPageProps {
    deletedCategories: Array<{
        id: string;
        codigo: string;
        nombre: string;
        categoria_slug: string;
        descripcion: string;
        estado: string;
        deleted_at: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard.url() },
    { title: 'Categorías', href: category.index.url() },
    { title: 'Papelera', href: '#' },
];

export default function TrashIndex({ deletedCategories = [] }: TrashPageProps) {
    // 1. Estado para manejar la selección de filas
    const [rowSelection, setRowSelection] = useState({});

    // 2. Extraer IDs seleccionados
    const selectedIds = Object.keys(rowSelection);

    // 3. Función para restaurar masivamente
    const handleMassRestore = () => {
    const selectedIds = Object.keys(rowSelection);
    router.patch('/category/mass-restore', { ids: selectedIds }, {
        onSuccess: () => {
            toast.success("Restaurados");
            setRowSelection({});
        }
    });
};

    // 4. Función para eliminar permanentemente masivo
    const handleMassDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    router.delete('/category/mass-force-delete', { 
        data: { ids: selectedIds }, // <--- IMPORTANTE: encerrar en 'data'
        onSuccess: () => {
            toast.success("Eliminados permanentemente");
            setRowSelection({});
        }
    });
};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Papelera de Categorías" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header de la Papelera */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => router.get('/category')}
                            className="hover:bg-zinc-800 text-zinc-400"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-rose-500 flex items-center gap-2">
                                <Trash2 className="h-6 w-6" />
                                Papelera de Categorías
                            </h1>
                            <p className="text-zinc-500 italic text-sm">
                                Gestión de registros eliminados temporalmente.
                            </p>
                        </div>
                    </div>

                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-lg text-sm font-bold shadow-inner">
                        Total eliminados: {deletedCategories.length}
                    </div>
                </div>

                {/* BARRA DE ACCIONES MASIVAS (Solo visible si hay selección) */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-center gap-2 text-zinc-300 text-sm font-medium">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            {selectedIds.length} seleccionados
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                size="sm"
                                onClick={handleMassRestore}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Restaurar Selección
                            </Button>
                            <Button 
                                size="sm"
                                variant="destructive"
                                onClick={handleMassDelete}
                                className="bg-rose-600 hover:bg-rose-700"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Borrar Definitivamente
                            </Button>
                        </div>
                    </div>
                )}

                {/* Tabla de Datos Eliminados */}
                    <DataTable 
                        columns={columnsDelete} 
                        data={deletedCategories}
                        // CONEXIÓN CON EL ESTADO DE SELECCIÓN
                       rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                    />

                {/* Nota de Auditoría */}
                <div className="mt-auto p-4 bg-zinc-900/50 rounded-lg flex items-center gap-3 border border-zinc-800">
                    <div className="p-2 bg-zinc-800 rounded-full text-zinc-400 border border-zinc-700">
                        <RotateCcw className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-zinc-500">
                        <strong className="text-zinc-300 font-semibold">Nota de Auditoría:</strong> Los registros restaurados mantendrán su código correlativo original y aparecerán nuevamente en el inventario activo.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
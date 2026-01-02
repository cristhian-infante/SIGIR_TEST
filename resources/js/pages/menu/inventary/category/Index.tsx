"use client"

import { useEffect, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react'; 
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import AppLayout from '@/layouts/app-layout';
import category from '@/routes/category';
import { dashboard } from '@/routes';
import { PageProps, type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/datatable'; 

import { BulkActions } from './components/BulkActions';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import { Columns } from './components/tables/Columns';
import { CategoryFormsInsert } from './components/forms/CategoryFormsInsert';
import { useCategoryActions } from './components/hooks/useCategoryActions';

// --- INTERFACES & CONSTANTS ---
export interface Category {
    id: string;
    codigo: string;
    nombre: string;
    estado: 'Activo' | 'Inactivo';
    // ... rest of properties
}

interface CategoryPageProps extends PageProps {
    dataCategories: Category[];
    countTrash?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Categorías', href: '#' },
];

export default function CategoryIndex({ dataCategories, countTrash = 0 }: CategoryPageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { props } = usePage();
    const { 
        rowSelection, 
        selectedRows, 
        handleRowSelectionChange, 
        bulkDelete, 
        bulkStatus 
    } = useCategoryActions(dataCategories);

    // Flash Messages
    useEffect(() => {
        const flash = props.flash as { success?: string; error?: string };
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [props.flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorías" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
                        <p className="text-muted-foreground">Gestión de inventario</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <BulkActions 
                            selectedRows={selectedRows}
                            onStatusChange={bulkStatus}
                            onDeleteClick={() => setShowDeleteAlert(true)}
                        />

                        <Button variant="outline" onClick={() => router.get(category.trash.url())}>
                            <Trash2 className="h-4 w-4 mr-2" /> Papelera
                            {countTrash > 0 && (
                                <span className="ml-2 bg-destructive text-white px-2 py-0.5 rounded-full text-[10px]">
                                    {countTrash}
                                </span>
                            )}
                        </Button>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2"><PlusCircle className="h-4 w-4" /> Nueva Categoría</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl p-0 overflow-hidden border-none">
                                <DialogTitle className="sr-only">Nueva Categoría</DialogTitle>
                                <DialogDescription className="sr-only">Formulario</DialogDescription>
                                <CategoryFormsInsert onClose={() => setIsDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <DataTable 
                    columns={Columns} 
                    data={dataCategories} 
                    rowSelection={rowSelection} 
                    onRowSelectionChange={handleRowSelectionChange}
                    pagination={pagination} 
                    onPaginationChange={setPagination} 
                />
            </div>

            <DeleteConfirmDialog 
                isOpen={showDeleteAlert}
                onOpenChange={setShowDeleteAlert}
                count={selectedRows.length}
                onConfirm={bulkDelete}
            />
        </AppLayout>
    );
}
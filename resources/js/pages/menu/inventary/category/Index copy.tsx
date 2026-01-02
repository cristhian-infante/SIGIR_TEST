"use client"

import { useEffect, useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react'; 
import { PlusCircle, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { PageProps, type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { 
    Dialog, DialogContent, DialogDescription, 
    DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
    AlertDialog, AlertDialogAction, AlertDialogCancel, 
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
    AlertDialogHeader, AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { DataTable } from '@/components/ui/datatable'; 

import { Columns } from './components/tables/Columns';
import { CategoryFormsInsert } from './components/forms/CategoryFormsInsert';
import category from '@/routes/category';

// --- INTERFACES ---
export interface Category {
    id: string;
    codigo: string;
    nombre: string;
    categoria_slug: string;
    descripcion: string;
    estado: 'Activo' | 'Inactivo';
    estado_num: number;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
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
    
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const [selectedRows, setSelectedRows] = useState<Category[]>([]);
    
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    
    const { props } = usePage();

    useEffect(() => {
        const flash = props.flash as { success?: string; error?: string };
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [props.flash]);

    const handleRowSelectionChange = (updaterOrValue: any) => {
        const nextSelection = typeof updaterOrValue === 'function' 
            ? updaterOrValue(rowSelection) 
            : updaterOrValue;
        setRowSelection(nextSelection);
        const selectedIds = Object.keys(nextSelection).filter(id => nextSelection[id]);
        const selectedObjects = dataCategories.filter(cat => selectedIds.includes(String(cat.id)));
        setSelectedRows(selectedObjects);
    };

    const bulkActions = useMemo(() => {
        if (!selectedRows || selectedRows.length === 0) return null;
        const estados = selectedRows.map(r => r.estado?.toLowerCase().trim());
        const todosActivos = estados.every(e => e === 'activo');
        const todosInactivos = estados.every(e => e === 'inactivo');
        return {
            showDeactivate: todosActivos,
            showActivate: todosInactivos,
            count: selectedRows.length
        };
    }, [selectedRows]);

    // Acción: Eliminación Masiva (Soft Delete)
    const handleBulkDelete = () => {
        router.post('/category/bulk-delete', { 
            ids: selectedRows.map(r => r.id) 
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setRowSelection({});
                setSelectedRows([]);
                setShowDeleteAlert(false); 
            }
        });
    };

    const handleBulkStatus = (newStatus: boolean) => {
        router.post('/category/bulk-status', { 
            ids: selectedRows.map(r => r.id),
            status: newStatus 
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setRowSelection({});
                setSelectedRows([]);
            }
        });
    };

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
                        {bulkActions && (
                            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                {bulkActions.showDeactivate && (
                                    <Button variant="outline" size="sm" className="text-orange-600 bg-orange-50 border-orange-200" onClick={() => handleBulkStatus(false)}>
                                        <XCircle className="mr-2 h-4 w-4" /> Desactivar ({bulkActions.count})
                                    </Button>
                                )}
                                {bulkActions.showActivate && (
                                    <Button variant="outline" size="sm" className="text-emerald-600 bg-emerald-50 border-emerald-200" onClick={() => handleBulkStatus(true)}>
                                        <CheckCircle className="mr-2 h-4 w-4" /> Activar ({bulkActions.count})
                                    </Button>
                                )}
                                {/* Este botón ahora solo abre el Alert */}
                                <Button variant="destructive" size="sm" onClick={() => setShowDeleteAlert(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar ({bulkActions.count})
                                </Button>
                            </div>
                        )}

                        <Button variant="outline" onClick={() => router.get(category.trash.url())}>
                            <Trash2 className="h-4 w-4 mr-2" /> Papelera
                            {countTrash > 0 && <span className="ml-2 bg-destructive text-white px-2 py-0.5 rounded-full text-[10px]">{countTrash}</span>}
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

            {/* ALERT DIALOG: Se encarga de la confirmación final */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar eliminación masiva?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de mover {selectedRows.length} categorías a la papelera. 
                            Podrás restaurarlas más tarde desde la sección correspondiente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleBulkDelete} 
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Confirmar Eliminación
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
'use client';

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
    Edit, 
    Eye, 
    MoreHorizontal, 
    RefreshCw, 
    Trash2 
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';

// Importaciones con nombres estandarizados (PascalCase)
import { SheetDetailsCategory } from './SheetDetailsCategory'; // Asegúrate que el archivo se llame así
import { Category } from '../../Index';
import { CategoryFormsUpdate } from '../forms/CategoryFormsUpdate';

interface ActionsCellProps {
    categoria: Category;
}

export const ActionsCell = ({ categoria }: ActionsCellProps) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const handleToggleStatus = () => {
        router.post(`/category/toggle-status/${categoria.id}`, {}, { 
            preserveState: true,
            preserveScroll: true 
        });
    };

    const handleDelete = () => {
        router.delete(`/category/destroy/${categoria.id}`, { 
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Gestión de Categoría</DropdownMenuLabel>
                    
                    <DropdownMenuSeparator />

                    {/* ACCIÓN: VER DETALLES */}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => setShowDetails(true)}
                    >
                        <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                    </DropdownMenuItem>

                    {/* ACCIÓN: EDITAR */}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => setShowEdit(true)}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>

                    {/* ACCIÓN: ACTIVAR/DESACTIVAR */}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleToggleStatus}
                    >
                        <RefreshCw
                            className={cn(
                                'mr-2 h-4 w-4 animate-in duration-500',
                                categoria.estado === 'Activo'
                                    ? 'text-amber-500 rotate-180'
                                    : 'text-emerald-500 rotate-0'
                            )}
                        />
                        {categoria.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* ACCIÓN: ELIMINAR (CON ALERTA) */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onSelect={(e) => e.preventDefault()} 
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Enviar a Papelera
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Enviar a la papelera?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta acción moverá la categoría{' '}
                                    <span className="font-bold text-foreground">
                                        "{categoria.nombre}"
                                    </span>{' '}
                                    a la sección de eliminados. Podrás restaurarla después.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    onClick={handleDelete}
                                >
                                    Confirmar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* MODAL DE DETALLES (SHEET) */}
            <SheetDetailsCategory
                categoria={categoria}
                open={showDetails}
                onOpenChange={setShowDetails}
            />

            {/* MODAL DE EDICIÓN (DIALOG) */}
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent className="max-w-2xl border-none p-0">
                    <DialogTitle className="sr-only">Editar Categoría</DialogTitle>
                    <DialogDescription className="sr-only">
                        Actualice la información de la categoría
                    </DialogDescription>
                    
                    <CategoryFormsUpdate 
                        categoria={categoria} 
                        onClose={() => setShowEdit(false)} 
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};
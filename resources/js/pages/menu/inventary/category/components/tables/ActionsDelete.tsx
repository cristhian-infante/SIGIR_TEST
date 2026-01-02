'use client';

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Categoria } from './Columns';
import { 
    RotateCcw, 
    Trash2, 
    MoreHorizontal, 
    AlertTriangle,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js'
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
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

export const ActionsCellDelete = ({ categoria }: { categoria: Categoria }) => {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const onRestore = () => {
        router.patch(`/category/${categoria.id}/restore`, {}, {
                onSuccess: () => toast.success("¡Categoría recuperada!"),
                onError: () => toast.error("No se pudo restaurar")
            });
    };
    const onPermanentDelete = () => {
        router.delete(`/category/${categoria.id}/force`, {
            onSuccess: () => toast.success("Eliminado permanentemente"),
            onError: () => toast.error("Error al eliminar")
        });
    };

    return (
        <div className="flex justify-end gap-2">
            {/* Acción Rápida: Restaurar */}
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-emerald-500/90 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white transition-all"
                onClick={onRestore}
            >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Restaurar
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Opciones Críticas</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => { /* Tu Sheet de detalles */ }}>
                        <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                        onClick={() => setShowDeleteAlert(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar Permanente
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Diálogo de Confirmación para Borrado Físico */}
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent className="border-red-100">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            ¿Confirmar eliminación absoluta?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción **no se puede deshacer**. Se eliminará la categoría 
                            <span className="font-bold text-slate-900 mx-1">"{categoria.nombre}"</span> 
                            y todos sus registros históricos de la base de datos principal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={onPermanentDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Eliminar para siempre
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
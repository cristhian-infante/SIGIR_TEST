import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CategoryFormsInsert } from './forms/CategoryFormsInsert';

interface CategoryHeaderProps {
    countTrash: number;
    onGoToTrash: () => void;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    children?: React.ReactNode; // Para inyectar BulkActions
}

export function CategoryHeader({ countTrash, onGoToTrash, isDialogOpen, setIsDialogOpen, children }: CategoryHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
                <p className="text-muted-foreground">Gestión de inventario</p>
            </div>

            <div className="flex items-center gap-2">
                {children} {/* Aquí aparecerán las BulkActions */}

                <Button variant="outline" onClick={onGoToTrash}>
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
                        <DialogDescription className="sr-only">Formulario de creación</DialogDescription>
                        <CategoryFormsInsert onClose={() => setIsDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
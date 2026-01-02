'use client';

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
import { Badge } from '@/components/ui/badge'; // Asegúrate de que esta ruta sea correcta
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    BadgeCheckIcon,
    Edit,
    Eye,
    MoreHorizontal,
    RefreshCw,
    Trash2,
    XCircle,
} from 'lucide-react';

export type Categoria = {
    id: string;
    codigo: string;
    nombre: string;
    categoria_slug: string;
    descripcion: string;
    estado: 'Activo' | 'Inactivo';
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
};

export const columns: ColumnDef<Categoria>[] = [
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
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'codigo',
        header: 'Código',
        cell: ({ row }) => (
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                {row.getValue('codigo')}
            </code>
        ),
    },
    {
        accessorKey: 'nombre',
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-4"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Nombre
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue('nombre')}</div>
        ),
    },
    // {
    //     accessorKey: 'categoria_slug',
    //     header: 'Slug',
    //     cell: ({ row }) => (
    //         <div className="text-xs text-muted-foreground">
    //             {row.getValue('categoria_slug')}
    //         </div>
    //     ),
    // },
    {
        accessorKey: 'descripcion',
        header: 'Descripción',
        cell: ({ row }) => (
            <div
                className="max-w-[200px] truncate"
                title={row.getValue('descripcion')}
            >
                {row.getValue('descripcion') || (
                    <span className="text-xs text-muted-foreground italic">
                        Sin descripción
                    </span>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'estado',
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-4"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Estado
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const estado = row.getValue('estado') as string;
            const isActivo = estado.toLowerCase() === 'activo';

            return (
                <Badge
                    variant="outline"
                    className={cn(
                        'flex w-fit items-center gap-1.5 px-2.5 py-0.5 font-semibold shadow-sm',
                        isActivo
                            ? 'border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'border-slate-500/50 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                    )}
                >
                    {isActivo ? (
                        <BadgeCheckIcon className="h-3.5 w-3.5" />
                    ) : (
                        <XCircle className="h-3.5 w-3.5" />
                    )}
                    <span className="capitalize">{estado}</span>
                </Badge>
            );
        },
    },
    // {
    //     accessorKey: 'created_at',
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             className="-ml-4"
    //             onClick={() =>
    //                 column.toggleSorting(column.getIsSorted() === 'asc')
    //             }
    //         >
    //             Creado
    //             <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => {
    //         const date = row.getValue('created_at');
    //         if (!date)
    //             return <div className="pl-4 text-muted-foreground">-</div>;
    //         return (
    //             <div className="pl-4 text-sm">
    //                 {new Date(date as string).toLocaleDateString('es-ES')}
    //             </div>
    //         );
    //     },
    // },
    // {
    //     accessorKey: 'updated_at',
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             className="-ml-4"
    //             onClick={() =>
    //                 column.toggleSorting(column.getIsSorted() === 'asc')
    //             }
    //         >
    //             Actualizado
    //             <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => {
    //         const date = row.getValue('updated_at');
    //         if (!date)
    //             return <div className="pl-4 text-muted-foreground">-</div>;
    //         return (
    //             <div className="pl-4 text-sm text-muted-foreground">
    //                 {new Date(date as string).toLocaleDateString('es-ES')}
    //             </div>
    //         );
    //     },
    // },
    // {
    //     accessorKey: 'deleted_at',
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             className="-ml-4"
    //             onClick={() =>
    //                 column.toggleSorting(column.getIsSorted() === 'asc')
    //             }
    //         >
    //             Eliminado
    //             <ArrowUpDown className="ml-2 h-4 w-4" />
    //         </Button>
    //     ),
    //     cell: ({ row }) => {
    //         const date = row.getValue('deleted_at');
    //         // Si no está eliminado, no mostramos nada o un guion sutil
    //         if (!date)
    //             return <div className="pl-4 text-muted-foreground/30">-</div>;

    //         return (
    //             <div className="pl-4 text-sm font-medium text-destructive/80">
    //                 {new Date(date as string).toLocaleDateString('es-ES')}
    //             </div>
    //         );
    //     },
    // },
    {
        id: 'actions',
        cell: ({ row }) => {
            const categoria = row.original;
            const isDeleted = !!categoria.deleted_at;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>
                            Gestión de Categoría
                        </DropdownMenuLabel>

                        {/* ACCIÓN: VER DETALLES */}
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => setShowDetails(true)}
                        >
                            <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                        </DropdownMenuItem>
                        {/* ACCIÓN: Activar o desactivar Categoria */}
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                                router.patch(
                                    `/category/toggle-status/${categoria.id}`,
                                    {},
                                    {
                                        preserveScroll: true,
                                    },
                                );
                            }}
                        >
                            <RefreshCw
                                className={cn(
                                    'mr-2 h-4 w-4',
                                    categoria.estado === 'Activo'
                                        ? 'text-amber-500'
                                        : 'text-emerald-500',
                                )}
                            />
                            {categoria.estado === 'Activo'
                                ? 'Desactivar'
                                : 'Activar'}
                        </DropdownMenuItem>
                        {/* ACCIÓN: Editar Categoria */}

                        <DropdownMenuItem
                            onClick={() => {
                                /* lógica editar */
                            }}
                        >
                            <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        {/* ACCIÓN: Enviar a Pepelera Categoria */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()} // 2. EVITA QUE EL MENÚ SE CIERRE AQUÍ
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Enviar a
                                    Papelera
                                </DropdownMenuItem>
                            </AlertDialogTrigger>

                            {/* contenido del diálogo (Esto se renderizará al centro por defecto) */}
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        ¿Enviar a la papelera?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción moverá la categoría{' '}
                                        <span className="font-bold text-foreground">
                                            "{categoria.nombre}"
                                        </span>{' '}
                                        a la sección de eliminados. Podrás
                                        restaurarla después si lo necesitas.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                        onClick={() => {
                                            router.delete(
                                                `/category/papelera/${categoria.id}`,
                                                {
                                                    preserveScroll: true,
                                                },
                                            );
                                        }}
                                    >
                                        Confirmar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

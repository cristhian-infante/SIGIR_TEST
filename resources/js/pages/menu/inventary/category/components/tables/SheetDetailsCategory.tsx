'use client';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Categoria } from "./tables/Columns";
import { 
    CalendarDays, 
    Clock, 
    Hash, 
    Tag, 
    Trash2, 
    FileText, 
    Globe, 
    Shield,
    Database,
    Layers,
    ChevronRight,
    User,
    History
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SheetDetailsCategoryProps {
    categoria: Categoria;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CompactDetail = ({ 
    label, 
    value, 
    icon: Icon, 
    variant = "default",
    showSeparator = true
}: { 
    label: string; 
    value: string | React.ReactNode; 
    icon?: React.ElementType;
    variant?: "default" | "info" | "warning" | "success" | "error";
    showSeparator?: boolean;
}) => {
    const variantColors = {
        default: "text-gray-600 dark:text-gray-400",
        info: "text-blue-600 dark:text-blue-400",
        warning: "text-amber-600 dark:text-amber-400",
        success: "text-emerald-600 dark:text-emerald-400",
        error: "text-red-600 dark:text-red-400"
    };

    return (
        <>
            <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                    {Icon && (
                        <div className="flex-shrink-0">
                            <Icon className={cn("w-3.5 h-3.5", variantColors[variant])} />
                        </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {label}
                    </span>
                </div>
                <div className={cn(
                    "text-sm ml-2 text-right",
                    variantColors[variant],
                    typeof value === 'string' && "font-medium truncate"
                )}>
                    {value}
                </div>
            </div>
            {showSeparator && <Separator className="last:hidden opacity-50" />}
        </>
    );
};

const StatusIndicator = ({ estado, isDeleted }: { estado: string; isDeleted: boolean }) => {
    if (isDeleted) {
        return (
            <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full border border-red-200 dark:border-red-800">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase text-red-700 dark:text-red-400">Eliminado</span>
            </div>
        );
    }
    const isActive = estado.toLowerCase() === 'activo';
    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full border",
            isActive ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
        )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-gray-400")}></div>
            <span className={cn("text-[10px] font-bold uppercase", isActive ? "text-emerald-700" : "text-gray-600")}>
                {estado}
            </span>
        </div>
    );
};

const DetailGroup = ({ title, icon: Icon, children }: { title?: string; icon?: React.ElementType; children: React.ReactNode }) => (
    <div className="space-y-2">
        {title && (
            <div className="flex items-center gap-1.5 px-1">
                {Icon && <Icon className="w-3 h-3 text-muted-foreground" />}
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</h3>
            </div>
        )}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
            {children}
        </div>
    </div>
);

export const SheetDetailsCategory = ({ categoria, open, onOpenChange }: SheetDetailsCategoryProps) => {
    const isDeleted = !!categoria.deleted_at;

    const formatDateCompact = (dateString: string | null) => {
        if (!dateString) return "No registrado";
        return new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md p-0 gap-0 border-l dark:border-slate-800">
                <div className="flex flex-col h-full">
                    {/* Header Principal */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-b dark:border-slate-800">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <div className="p-2 w-fit rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-3">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <SheetTitle className="text-xl font-bold tracking-tight">{categoria.nombre}</SheetTitle>
                                <SheetDescription className="flex items-center gap-2 font-mono text-xs">
                                    <Hash className="w-3 h-3" /> {categoria.codigo}
                                </SheetDescription>
                            </div>
                            <StatusIndicator estado={categoria.estado} isDeleted={isDeleted} />
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* Grupo 1: Identificación técnica */}
                        <DetailGroup title="Identificación de Recurso" icon={Database}>
                            <CompactDetail label="URL Slug" value={`/${categoria.categoria_slug}`} icon={Globe} variant="info" />
                            <CompactDetail label="ID Interno" value={categoria.id} icon={Hash} showSeparator={false} />
                        </DetailGroup>

                        {/* Grupo 2: Auditoría (Aquí es donde brilla el sistema de logs) */}
                        <DetailGroup title="Trazabilidad y Auditoría" icon={Shield}>
                            <CompactDetail 
                                label="Creado por" 
                                value="Sistema / Admin" // Futuro: {categoria.creator.name}
                                icon={User} 
                            />
                            <CompactDetail 
                                label="Fecha de Registro" 
                                value={formatDateCompact(categoria.created_at)} 
                                icon={CalendarDays} 
                                variant="success"
                            />
                            <Separator className="my-2" />
                            <CompactDetail 
                                label="Última modificación" 
                                value={formatDateCompact(categoria.updated_at)} 
                                icon={History} 
                            />
                            {isDeleted && (
                                <CompactDetail 
                                    label="Fecha eliminación" 
                                    value={formatDateCompact(categoria.deleted_at)} 
                                    icon={Trash2} 
                                    variant="error" 
                                    showSeparator={false}
                                />
                            )}
                        </DetailGroup>

                        {/* Grupo 3: Descripción */}
                        <DetailGroup title="Contenido Informativo" icon={FileText}>
                            <div className="pt-1">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    {categoria.descripcion || "Sin descripción detallada registrada."}
                                </p>
                            </div>
                        </DetailGroup>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-800">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold tracking-widest px-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-3 h-3" />
                                <span>Verificado por Auditoría</span>
                            </div>
                            <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
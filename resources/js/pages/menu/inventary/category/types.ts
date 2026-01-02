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

export interface CategoryPageProps {
    dataCategories: Category[];
    countTrash?: number;
}
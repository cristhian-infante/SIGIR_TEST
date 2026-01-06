<?php

namespace App\Services;

use App\Models\Categoria;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    private function formatCategory($categoria)
    {
        return [
            'id'             => $categoria->id,
            'codigo'         => $categoria->codigo,
            'nombre'         => $categoria->nombre,
            'categoria_slug' => $categoria->categoria_slug,
            'descripcion'    => $categoria->descripcion,
            'estado'         => $categoria->estado ? 'Activo' : 'Inactivo',
            'estado_num'     => $categoria->estado ? 1 : 0,
            'created_at'     => $categoria->created_at,
            'updated_at'     => $categoria->updated_at,
            'deleted_at'     => $categoria->deleted_at,
        ];
    }

    public function updateCategory($id, array $data)
    {
        $categoria = Categoria::findOrFail($id);
        return $categoria->update($data);
    }

    public function toggleStatus($id)
    {
        $category = Categoria::withTrashed()->findOrFail($id);
        $category->estado = !$category->estado;
        return $category->save();
    }

    public function bulkStatus(array $ids, bool $status)
    {
        return Categoria::whereIn('id', $ids)->update(['estado' => $status]);
    }

    public function bulkDelete(array $ids)
    {
        return DB::transaction(fn() => Categoria::whereIn('id', $ids)->delete());
    }

    public function getAllCategories($perPage = null)
    {
        $query = Categoria::orderBy('created_at', 'desc');
        $categories = $perPage ? $query->paginate($perPage) : $query->get();
        return $categories->map(fn($c) => $this->formatCategory($c));
    }

    public function getAllTrashCategories()
    {
        return Categoria::onlyTrashed()->get()->map(fn($c) => $this->formatCategory($c));
    }

    public function createCategory(array $data)
    {
        return Categoria::create($data); // La lógica de slugs está en el boot del Modelo
    }

    public function destroyCategory($id)
    {
        try {
            return Categoria::findOrFail($id)->delete();
        } catch (\Exception $e) {
            Log::error("Error eliminando categoría ID {$id}: " . $e->getMessage());
            return false;
        }
    }

    public function restoreCategory($id)
    {
        try {
            return Categoria::onlyTrashed()->findOrFail($id)->restore();
        } catch (\Exception $e) {
            Log::error("Error restaurando categoría ID {$id}: " . $e->getMessage());
            return false;
        }
    }

    public function forceDeleteCategory($id)
    {
        try {
            return Categoria::withTrashed()->findOrFail($id)->forceDelete();
        } catch (\Exception $e) {
            Log::error("Error en borrado definitivo de categoría ID {$id}: " . $e->getMessage());
            return false;
        }
    }

    public function restoreMassive(array $ids)
    {
        try {
            return Categoria::onlyTrashed()->whereIn('id', $ids)->restore();
        } catch (\Exception $e) {
            Log::error("Error en restauración masiva: " . $e->getMessage());
            return false;
        }
    }

    public function forceDeleteMassive(array $ids)
    {
        try {
            return Categoria::onlyTrashed()->whereIn('id', $ids)->forceDelete();
        } catch (\Exception $e) {
            Log::error("Error en eliminación física masiva: " . $e->getMessage());
            return false;
        }
    }
}
<?php

namespace App\Services;

use App\Models\Categoria;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    /**
     * Formateador común para los resultados de categoría
     */
    private function formatCategory($categoria)
    {
        return [
            'id'             => $categoria->id,
            'codigo'         => $categoria->codigo,
            'nombre'         => $categoria->nombre,
            'categoria_slug' => $categoria->categoria_slug,
            'descripcion'    => $categoria->descripcion,
            'estado'         => $categoria->estado == 1 ? 'Activo' : 'Inactivo',
            'estado_num'     => $categoria->estado,
            'created_at'     => $categoria->created_at,
            'updated_at'     => $categoria->updated_at,
            'deleted_at'     => $categoria->deleted_at,
        ];
    }

    public function getAllCategories()
    {
        return Categoria::all()->map(fn($c) => $this->formatCategory($c));
    }

    public function getAllTrashCategories()
    {
        return Categoria::onlyTrashed()->get()->map(fn($c) => $this->formatCategory($c));
    }

    public function createCategory(array $data)
    {
        return DB::transaction(function () use ($data) {
            $data['codigo'] = $data['codigo'] ?: $this->generateUniqueCode($data['nombre']);
            $data['categoria_slug'] = $this->generateUniqueSlug($data['categoria_slug'] ?: $data['nombre']);
            return Categoria::create($data);
        });
    }

    public function destroyCategory(string $id)
    {
        try {
            return Categoria::findOrFail($id)->delete();
        } catch (\Exception $e) {
            Log::error("Error eliminando categoría ID {$id}: " . $e->getMessage());
            return false;
        }
    }

    public function restoreCategory(string $id)
    {
        try {
            return Categoria::onlyTrashed()->findOrFail($id)->restore();
        } catch (\Exception $e) {
            Log::error("Error restaurando categoría ID {$id}: " . $e->getMessage());
            return false;
        }
    }

    public function forceDeleteCategory(string $id)
    {
        try {
            return Categoria::withTrashed()->findOrFail($id)->forceDelete();
        } catch (\Exception $e) {
            Log::error("Error en borrado definitivo de categoría ID {$id}: " . $e->getMessage());
            return false;
        }
    }

    // --- MÉTODOS MASIVOS ---

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

    // --- MÉTODOS PRIVADOS DE GENERACIÓN ---

    private function generateUniqueCode(string $nombre): string
    {
        $prefix = str(preg_replace('/[^A-Za-z]/', '', $nombre))
                    ->limit(3, '')
                    ->upper()
                    ->padRight(3, 'X');

        $lastCode = Categoria::where('codigo', 'LIKE', "$prefix-%")
                    ->orderBy('codigo', 'desc')
                    ->value('codigo');

        $nextNumber = $lastCode ? (intval(substr(strrchr($lastCode, '-'), 1)) + 1) : 1;
        return $prefix . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    private function generateUniqueSlug(string $text): string
    {
        $slug = str($text)->slug()->toString();
        $originalSlug = $slug;
        $counter = 1;

        while (Categoria::where('categoria_slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        return $slug;
    }
}
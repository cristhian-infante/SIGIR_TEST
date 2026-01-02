<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoriaRequest;
use App\Models\Categoria;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $categorias = $this->categoryService->getAllCategories();

        return Inertia::render('menu/inventary/category/Index', [
            'dataCategories' => $categorias,
        ]);
    }

    public function store(CategoriaRequest $request)
    {
        $validated = $request->validated();
        try {
            $this->categoryService->createCategory($validated);
            return redirect()->route('category.index')
                ->with('success', 'Categoría creada exitosamente');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Error al crear: ' . $e->getMessage()
            ])->withInput();
        }
    }
    public function toggleStatus($id)
    {
        try {
            // Buscamos la categoría incluyendo las eliminadas (por si acaso)
            $category = Categoria::withTrashed()->findOrFail($id);

            // Cambiamos el estado (si es 1 pasa a 0, si es 0 pasa a 1)
            // O si usas booleanos: $category->estado = !$category->estado;
            $category->estado = $category->estado == 1 ? 0 : 1;
            $category->save();

            return back()->with('success', 'Estado actualizado correctamente');
        } catch (\Exception $e) {
            // Esto te ayudará a ver el error real en los logs de Laravel
            \Log::error('Error en toggleStatus: '.$e->getMessage());

            return back()->withErrors(['error' => 'No se pudo actualizar el estado']);
        }
    }

    public function destroy($id)
    {
        $result = $this->categoryService->destroyCategory($id);
        if ($result) {
            return back()->with('success', 'Categoría enviada a la papelera correctamente.');
        }

        return back()->withErrors(['error' => 'No se pudo eliminar la categoría.']);
    }

    public function trashIndex()
    {
        $trashCategorias = $this->categoryService->getAllTrashCategories();

        return Inertia::render('menu/inventary/category/Trash', [
            'deletedCategories' => $trashCategorias,
        ]);

    }

    public function restore($id)
    {
        $result = $this->categoryService->restoreCategory($id);

        if ($result) {
            return back()->with('success', 'La categoría ha sido restaurada y devuelta al inventario activo.');
        }

        return back()->withErrors(['error' => 'No se pudo restaurar la categoría. Inténtelo de nuevo.']);
    }

    public function forceDelete($id)
    {
        $result = $this->categoryService->forceDeleteCategory($id);

        if ($result) {
            return back()->with('success', 'Categoría eliminada permanentemente de la base de datos.');
        }

        return back()->withErrors(['error' => 'No se pudo eliminar definitivamente.']);
    }

    public function massRestore(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        $result = $this->categoryService->restoreMassive($request->ids);

        if ($result) {
            return back()->with('success', count($request->ids) . ' categorías restauradas.');
        }
        return back()->withErrors(['error' => 'Error al restaurar categorías.']);
    }

    public function massForceDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        $this->categoryService->forceDeleteMassive($request->ids);

        return back()->with('success', 'Registros eliminados permanentemente.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categorias,id'
        ]);

        // Al usar el Trait SoftDeletes en el modelo, delete() hará el borrado lógico
        Categoria::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Categorías eliminadas correctamente');
    }

    public function bulkStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'status' => 'required|boolean', // Recibimos true o false
        ]);

        $nuevoEstado = $request->status ? 1 : 0;

        // Actualización masiva en la base de datos
        \App\Models\Categoria::whereIn('id', $request->ids)
            ->update(['estado' => $nuevoEstado]);

        $mensaje = $request->status ? 'Categorías activadas.' : 'Categorías desactivadas.';
        
        return back()->with('success', $mensaje);
    }
    public function update(Request $request, $id)
{
    $request->validate([
        'nombre' => 'required|string|max:100',
        'codigo' => 'nullable|string|max:20',
        'descripcion' => 'nullable|string|max:500',
        'estado' => 'required|integer' // Recibe 1 o 0
    ]);

    $categoria = \App\Models\Categoria::findOrFail($id);
    
    $categoria->update([
        'nombre' => $request->nombre,
        'codigo' => $request->codigo,
        'categoria_slug' => $request->categoria_slug,
        'descripcion' => $request->descripcion,
        'estado' => $request->estado,
    ]);

    return back()->with('success', 'Categoría actualizada correctamente');
}
}

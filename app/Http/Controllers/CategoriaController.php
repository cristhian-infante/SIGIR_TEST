<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoriaRequest;
use App\Models\Categoria;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        return Inertia::render('menu/inventary/category/Index', [
            'dataCategories' => $this->categoryService->getAllCategories(),
            'countTrash'     => Categoria::onlyTrashed()->count(),
        ]);
    }

    public function store(CategoriaRequest $request)
    {
        try {
            $this->categoryService->createCategory($request->validated());
            return redirect()->route('category.index')->with('success', 'Categoría creada exitosamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al crear: ' . $e->getMessage()])->withInput();
        }
    }

    public function update(CategoriaRequest $request, $id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->update($request->validated());
        return back()->with('success', 'Categoría actualizada correctamente');
    }

    public function toggleStatus($id)
    {
        try {
            $category = Categoria::withTrashed()->findOrFail($id);
            $category->estado = !$category->estado;
            $category->save();
            return back()->with('success', 'Estado actualizado correctamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'No se pudo actualizar el estado']);
        }
    }

    public function destroy($id)
    {
        if ($this->categoryService->destroyCategory($id)) {
            return back()->with('success', 'Categoría enviada a la papelera.');
        }
        return back()->withErrors(['error' => 'No se pudo eliminar.']);
    }

    public function trashIndex()
    {
        return Inertia::render('menu/inventary/category/Trash', [
            'deletedCategories' => $this->categoryService->getAllTrashCategories(),
        ]);
    }

    public function restore($id)
    {
        if ($this->categoryService->restoreCategory($id)) {
            return back()->with('success', 'Categoría restaurada.');
        }
        return back()->withErrors(['error' => 'Error al restaurar.']);
    }

    public function forceDelete($id)
    {
        if ($this->categoryService->forceDeleteCategory($id)) {
            return back()->with('success', 'Eliminada permanentemente.');
        }
        return back()->withErrors(['error' => 'Error al eliminar definitivamente.']);
    }

    public function massRestore(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        if ($this->categoryService->restoreMassive($request->ids)) {
            return back()->with('success', count($request->ids) . ' restauradas.');
        }
        return back()->withErrors(['error' => 'Error en restauración masiva.']);
    }

    public function massForceDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        $this->categoryService->forceDeleteMassive($request->ids);
        return back()->with('success', 'Registros eliminados permanentemente.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'exists:categorias,id']);
        Categoria::whereIn('id', $request->ids)->delete();
        return back()->with('success', 'Categorías enviadas a papelera.');
    }

    public function bulkStatus(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'status' => 'required|boolean']);
        Categoria::whereIn('id', $request->ids)->update(['estado' => $request->status]);
        return back()->with('success', 'Estados actualizados.');
    }
}
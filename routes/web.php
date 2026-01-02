<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CategoriaController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () { return Inertia::render('dashboard'); })->name('dashboard');

    Route::prefix('category')->name('category.')->group(function () {
        // Rutas Estándar
        Route::get('/', [CategoriaController::class, 'index'])->name('index');
        Route::post('/store', [CategoriaController::class, 'store'])->name('store');
        Route::put('/update/{id}', [CategoriaController::class, 'update'])->name('update');
        Route::post('/toggle-status/{id}', [CategoriaController::class, 'toggleStatus'])->name('toggleStatus');
        Route::delete('/destroy/{id}', [CategoriaController::class, 'destroy'])->name('destroy');

        // Acciones Masivas (Usamos match para mayor flexibilidad con el Frontend)
        Route::post('/bulk-delete', [CategoriaController::class, 'bulkDelete'])->name('bulkDelete');
        Route::post('/bulk-status', [CategoriaController::class, 'bulkStatus'])->name('bulkStatus');
        
        // Papelera y Restauración
        Route::get('/papelera', [CategoriaController::class, 'trashIndex'])->name('trash');
        Route::post('/restore/{id}', [CategoriaController::class, 'restore'])->name('restore');
        Route::delete('/force-delete/{id}', [CategoriaController::class, 'forceDelete'])->name('forceDelete');

        // Estas rutas aceptan tanto el método directo como POST (spoofing de Inertia)
        Route::match(['post', 'patch'], '/mass-restore', [CategoriaController::class, 'massRestore'])->name('massRestore');
        Route::match(['post', 'delete'], '/mass-force-delete', [CategoriaController::class, 'massForceDelete'])->name('massForceDelete');
    }); 
});

require __DIR__.'/settings.php';
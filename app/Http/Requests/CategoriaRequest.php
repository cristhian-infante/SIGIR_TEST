<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class CategoriaRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $categoriaId = $this->route('category') ?? $this->route('id');
        if (is_object($categoriaId)) { $categoriaId = $categoriaId->id; }

        return [
            'nombre' => 'required|string|min:3|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'estado' => 'required|boolean',
            'categoria_slug' => [
                'nullable', 'string', 'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('categorias')->ignore($categoriaId)
            ],
            'codigo' => [
                'nullable', 'string', 'max:50',
                'regex:/^[A-Z0-9-]+$/',
                Rule::unique('categorias')->ignore($categoriaId)
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'categoria_slug' => $this->categoria_slug ? Str::slug($this->categoria_slug) : null,
            'codigo' => $this->codigo ? strtoupper(trim($this->codigo)) : null,
            'estado' => $this->has('estado') ? filter_var($this->estado, FILTER_VALIDATE_BOOLEAN) : true,
        ]);
    }
}
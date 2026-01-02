<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Categoria extends Model
{
    use SoftDeletes;

    protected $table = 'categorias';

    protected $fillable = [
        'codigo',
        'nombre',
        'categoria_slug',
        'descripcion',
        'estado'
    ];

    protected $casts = [
        'estado' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($categoria) {
            if (empty($categoria->codigo)) {
                $categoria->codigo = $categoria->generarCodigo();
            }
            if (empty($categoria->categoria_slug)) {
                $categoria->categoria_slug = $categoria->generarSlug();
            } else {
                $categoria->categoria_slug = Str::slug($categoria->categoria_slug);
            }
        });

        static::updating(function ($categoria) {
            if ($categoria->isDirty('nombre') && !$categoria->slugFuePersonalizado()) {
                $categoria->categoria_slug = $categoria->generarSlug();
            } elseif ($categoria->isDirty('categoria_slug')) {
                $categoria->categoria_slug = Str::slug($categoria->categoria_slug);
            }
        });
    }

    public function generarCodigo(): string
    {
        $prefijo = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $this->nombre), 0, 3));
        if (strlen($prefijo) < 3) $prefijo = 'CAT';
        $anio = date('Y');
        $ultimo = static::withTrashed()
            ->where('codigo', 'like', "{$prefijo}-{$anio}%")
            ->orderBy('codigo', 'desc')
            ->first();
        $numero = $ultimo && preg_match('/-(\d+)$/', $ultimo->codigo, $matches) 
            ? intval($matches[1]) + 1 
            : 1;
        return "{$prefijo}-{$anio}" . str_pad($numero, 3, '0', STR_PAD_LEFT);
    }

    public function generarSlug(): string
    {
        $slug = Str::slug($this->nombre);
        return $this->hacerSlugUnico($slug);
    }

    private function hacerSlugUnico(string $slug): string
    {
        $original = $slug;
        $count = 1;
        while ($this->slugExiste($slug)) {
            $slug = $original . '-' . $count;
            $count++;
        }
        return $slug;
    }

    private function slugExiste(string $slug): bool
    {
        $query = static::where('categoria_slug', $slug);
        if ($this->exists) {
            $query->where('id', '!=', $this->id);
        }
        return $query->exists();
    }

    public function slugFuePersonalizado(): bool
    {
        if (!$this->exists) return false;
        $nombreOriginal = $this->getOriginal('nombre') ?? $this->nombre;
        $slugAutomatico = Str::slug($nombreOriginal);
        $slugOriginal = $this->getOriginal('categoria_slug');
        return $slugAutomatico !== $slugOriginal;
    }
}
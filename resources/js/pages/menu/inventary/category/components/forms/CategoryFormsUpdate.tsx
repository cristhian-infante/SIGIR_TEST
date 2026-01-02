"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import { 
  Tag, Hash, Package, FileText, Shield, 
  Save, RefreshCw, X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { router } from "@inertiajs/react"
import { Category } from "../../Index"

// El mismo esquema de validación para mantener consistencia
const categorySchema = z.object({
  codigo: z.string().min(2, "Mínimo 2 caracteres").max(20).optional().or(z.literal('')), 
  nombre: z.string().min(3, "El nombre es obligatorio").max(100),
  categoria_slug: z.string().min(3).max(100).optional().or(z.literal('')),
  descripcion: z.string().max(500).optional().or(z.literal('')),
  estado: z.enum(["1", "0"]),
})

interface CategoryFormsUpdateProps {
  categoria: Category
  onClose: () => void
}

export function CategoryFormsUpdate({ categoria, onClose }: CategoryFormsUpdateProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const form = useForm({
    defaultValues: {
      codigo: categoria.codigo || "",
      nombre: categoria.nombre || "",
      categoria_slug: categoria.categoria_slug || "",
      descripcion: categoria.descripcion || "",
      // Convertimos el estado de texto ('Activo') a string numérico ('1') para el switch
      estado: (categoria.estado.toLowerCase() === 'activo' ? "1" : "0") as "1" | "0",
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      
      const formData = {
        ...value,
        _method: 'PUT', // Spoofing para Laravel si usas router.post o router.put directamente
        estado: value.estado === "1",
      }
      
      router.post(`/category/update/${categoria.id}`, formData, {
        preserveScroll: true,
        onSuccess: () => {
          onClose();
        },
        onError: (errors) => {
          const firstError = Object.values(errors)[0];
          toast.error(typeof firstError === 'string' ? firstError : "Error al actualizar");
        },
        onFinish: () => setIsSubmitting(false)
      })
    },
  })

  return (
    <Card className="w-full border-none shadow-none">
      <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}>
        <CardHeader className="pb-3 pt-4 px-4 sm:px-6 border-b bg-muted/10"> 
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500 text-white"> 
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Editar Categoría</CardTitle>
                <CardDescription>ID: {String(categoria.id).substring(0, 8)}...</CardDescription>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-5 px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CÓDIGO */}
            <form.Field name="codigo" children={(field) => (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" /> Código
                </Label>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
                  disabled={isSubmitting}
                />
              </div>
            )} />
            
            {/* NOMBRE */}
            <form.Field name="nombre" children={(field) => (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" /> Nombre *
                </Label>
                <Input
                  value={field.state.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.handleChange(val);
                    form.setFieldValue('categoria_slug', generateSlug(val));
                  }}
                  disabled={isSubmitting}
                />
              </div>
            )} />
          </div>
          
          {/* SLUG */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" /> Slug / URL
            </Label>
            <form.Field name="categoria_slug" children={(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(generateSlug(e.target.value))}
                disabled={isSubmitting}
                className="bg-muted/30 font-mono text-xs"
              />
            )} />
          </div>
          
          <Separator />
          
          {/* DESCRIPCIÓN */}
          <form.Field name="descripcion" children={(field) => (
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" /> Descripción
              </Label>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isSubmitting}
              />
            </div>
          )} />
          
          {/* ESTADO */}
          <form.Field name="estado" children={(field) => (
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/5">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" /> Visibilidad
                </Label>
                <p className="text-xs text-muted-foreground">Define si la categoría está disponible</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={field.state.value === "1" ? "default" : "secondary"}>
                  {field.state.value === "1" ? "ACTIVO" : "INACTIVO"}
                </Badge>
                <Switch
                  checked={field.state.value === "1"}
                  onCheckedChange={(checked) => field.handleChange(checked ? "1" : "0")}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )} />
        </CardContent>
        
        <CardFooter className="border-t bg-muted/5 p-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px] font-bold bg-amber-600 hover:bg-amber-700">
            {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
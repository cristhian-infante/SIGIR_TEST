"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import { 
  Tag, Hash, Package, FileText, Shield, 
  PlusCircle, RefreshCw
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

// Esquema de validación
const categorySchema = z.object({
  codigo: z.string().min(2, "Mínimo 2 caracteres").max(20).optional().or(z.literal('')), 
  nombre: z.string().min(3, "El nombre es obligatorio").max(100),
  categoria_slug: z.string().min(3).max(100).optional().or(z.literal('')),
  descripcion: z.string().max(500).optional().or(z.literal('')),
  estado: z.enum(["1", "0"]).default("1"),
})

interface CategoryFormInsertProps {
  withoutCardWrapper?: boolean
  onSuccess?: () => void
  onClose?: () => void
}

/**
 * CAMBIO CLAVE: Nombre en PascalCase (CategoryFormsInsert) 
 * para cumplir con los estándares de React y evitar errores de exportación.
 */
export function CategoryFormsInsert({ 
  withoutCardWrapper = false, 
  onSuccess,
  onClose 
}: CategoryFormInsertProps) {
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
      codigo: "",
      nombre: "",
      categoria_slug: "",
      descripcion: "",
      estado: "1" as "1" | "0",
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      const formData = {
        ...value,
        codigo: value.codigo?.trim() || null,
        estado: value.estado === "1", // Convertir a booleano para el backend
      }
      
      router.post('/category/store', formData, {
        preserveScroll: true,
        onSuccess: () => {
          form.reset();
          onSuccess?.();
          onClose?.();
        },
        onError: (errors) => {
          const firstError = Object.values(errors)[0];
          toast.error(typeof firstError === 'string' ? firstError : "Error al crear la categoría");
        },
        onFinish: () => setIsSubmitting(false)
      })
    },
  })

  const formContent = (
    <form 
      onSubmit={(e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        form.handleSubmit(); 
      }} 
      className="space-y-6"
    >
      <CardHeader className="pb-3 pt-4 px-4 sm:px-6 border-b bg-muted/10"> 
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground"> 
            <Package className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Nueva Categoría</CardTitle>
            <CardDescription>Gestión de clasificaciones para el inventario</CardDescription>
          </div>
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
                placeholder="REP-001"
                disabled={isSubmitting}
              />
            </div>
          )} />
          
          {/* NOMBRE */}
          <form.Field name="nombre" children={(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" /> Nombre *
                </Label>
                <Badge variant="secondary" className="text-[10px] uppercase">Requerido</Badge>
              </div>
              <Input
                value={field.state.value}
                onChange={(e) => {
                  const val = e.target.value;
                  field.handleChange(val);
                  form.setFieldValue('categoria_slug', generateSlug(val));
                }}
                placeholder="Ej: Motores"
                required
                disabled={isSubmitting}
              />
            </div>
          )} />
        </div>
        
        {/* SLUG */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-muted-foreground" /> Slug / URL
          </Label>
          <form.Field name="categoria_slug" children={(field) => (
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(generateSlug(e.target.value))}
              placeholder="nombre-de-la-categoria"
              disabled={isSubmitting}
              className="bg-muted/30"
            />
          )} />
        </div>
        
        <Separator className="my-4" />
        
        {/* DESCRIPCIÓN */}
        <form.Field name="descripcion" children={(field) => (
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" /> Descripción
            </Label>
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Breve descripción de la categoría..."
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
                <Shield className="h-4 w-4 text-muted-foreground" /> Estado
              </Label>
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
      
      <CardFooter className="border-t bg-muted/5 p-6 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">* Campos obligatorios</span>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
            Limpiar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[140px] font-bold">
            {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            {isSubmitting ? "Guardando..." : "Crear Categoría"}
          </Button>
        </div>
      </CardFooter>
    </form>
  )

  return withoutCardWrapper ? formContent : <Card className="w-full shadow-lg border-muted">{formContent}</Card>
}
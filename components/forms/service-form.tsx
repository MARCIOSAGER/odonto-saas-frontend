"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema, ServiceInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface ServiceFormProps {
  initialData?: any | null
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function ServiceForm({ initialData, onSubmit, onCancel, loading }: ServiceFormProps) {
  const isEditing = !!initialData
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      name: "",
      duration: 30,
      price: 0,
      description: ""
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nome do Serviço</label>
        <Input {...register("name")} placeholder="Ex: Limpeza, Canal, etc." className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Duração (minutos)</label>
          <Input type="number" {...register("duration")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preço (R$)</label>
          <Input type="number" step="0.01" {...register("price")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Descrição</label>
        <Textarea {...register("description")} placeholder="Breve descrição do procedimento..." className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="text-gray-700 dark:text-gray-300">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            isEditing ? "Atualizar" : "Cadastrar"
          )}
        </Button>
      </div>
    </form>
  )
}

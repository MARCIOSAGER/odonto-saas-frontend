"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema, ServiceInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface ServiceFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function ServiceForm({ initialData, onSubmit, onCancel, loading }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      nome: "",
      duracao: 30,
      preco: 0,
      descricao: ""
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome do Serviço</label>
        <Input {...register("nome")} placeholder="Ex: Limpeza, Canal, etc." />
        {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Duração (minutos)</label>
          <Input type="number" {...register("duracao")} />
          {errors.duracao && <p className="text-xs text-destructive">{errors.duracao.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Preço (R$)</label>
          <Input type="number" step="0.01" {...register("preco")} />
          {errors.preco && <p className="text-xs text-destructive">{errors.preco.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição</label>
        <Textarea {...register("descricao")} placeholder="Breve descrição do procedimento..." />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Salvando..." : "Salvar Serviço"}
        </Button>
      </div>
    </form>
  )
}

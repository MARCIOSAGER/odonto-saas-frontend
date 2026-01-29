"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { patientSchema, PatientInput } from "@/lib/validations"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export function PatientForm({ 
  onSubmit, 
  onCancel, 
  loading,
  initialData 
}: { 
  onSubmit: (values: PatientInput) => void; 
  onCancel?: () => void; 
  loading?: boolean;
  initialData?: any;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData || { status: "Ativo" }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} aria-label="Formulário de paciente">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nome completo *</label>
            <Input {...register("nome")} placeholder="Ex: João Silva" aria-invalid={!!errors.nome} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Telefone *</label>
            <Input {...register("telefone")} placeholder="(11) 99999-9999" aria-invalid={!!errors.telefone} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            {errors.telefone && <p className="text-xs text-destructive">{errors.telefone.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">CPF</label>
            <Input {...register("cpf")} placeholder="000.000.000-00" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">E-mail</label>
            <Input type="email" {...register("email")} placeholder="joao@exemplo.com" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Data nascimento</label>
            <Input type="date" {...register("dataNascimento")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
            <select className="h-10 w-full rounded-md border border-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" {...register("status")}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Endereço</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              {...register("endereco")} 
              placeholder="Rua, Número, Bairro, Cidade..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} className="text-gray-700 dark:text-gray-300">Cancelar</Button>
          <Button type="submit" disabled={loading} aria-busy={loading} className="min-w-[120px]">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </form>
  )
}

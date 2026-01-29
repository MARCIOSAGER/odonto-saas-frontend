"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { dentistSchema, DentistInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface DentistFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function DentistForm({ initialData, onSubmit, onCancel, loading }: DentistFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DentistInput>({
    resolver: zodResolver(dentistSchema),
    defaultValues: initialData || {
      nome: "",
      cro: "",
      especialidade: "",
      telefone: "",
      email: ""
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nome Completo</label>
          <Input {...register("nome")} placeholder="Dr. Exemplo" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">CRO</label>
            <Input {...register("cro")} placeholder="12345-UF" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            {errors.cro && <p className="text-xs text-destructive">{errors.cro.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Especialidade</label>
            <Input {...register("especialidade")} placeholder="Ex: Ortodontia" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            {errors.especialidade && <p className="text-xs text-destructive">{errors.especialidade.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Telefone</label>
          <Input {...register("telefone")} placeholder="(11) 99999-9999" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">E-mail</label>
          <Input type="email" {...register("email")} placeholder="dr@exemplo.com" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
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
              "Salvar Dentista"
            )}
          </Button>
        </div>
      </form>
  )
}

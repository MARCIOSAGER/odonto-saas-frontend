"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { appointmentSchema, AppointmentInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usePatients } from "@/hooks/usePatients"
import { useDentists } from "@/hooks/useDentists"
import { useServices } from "@/hooks/useServices"
import { Loader2 } from "lucide-react"

interface AppointmentFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function AppointmentForm({ onSubmit, onCancel, loading }: AppointmentFormProps) {
  const { patients, isLoading: loadingPatients } = usePatients()
  const { dentists, isLoading: loadingDentists } = useDentists()
  const { services, isLoading: loadingServices } = useServices()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema)
  })

  const isLoading = loadingPatients || loadingDentists || loadingServices

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Paciente</label>
        <select
          {...register("pacienteId")}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Selecione um paciente</option>
          {patients.map((p: any) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
        {errors.pacienteId && <p className="text-xs text-destructive">{errors.pacienteId.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dentista</label>
        <select
          {...register("dentistaId")}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Selecione um dentista</option>
          {dentists.map((d: any) => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
        </select>
        {errors.dentistaId && <p className="text-xs text-destructive">{errors.dentistaId.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Serviço</label>
        <select
          {...register("servicoId")}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Selecione um serviço</option>
          {services.map((s: any) => (
            <option key={s.id} value={s.id}>{s.nome} - R$ {s.preco}</option>
          ))}
        </select>
        {errors.servicoId && <p className="text-xs text-destructive">{errors.servicoId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Data</label>
          <Input type="date" {...register("data")} />
          {errors.data && <p className="text-xs text-destructive">{errors.data.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Hora</label>
          <Input type="time" {...register("hora")} />
          {errors.hora && <p className="text-xs text-destructive">{errors.hora.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Observações</label>
        <Textarea {...register("observacoes")} placeholder="Alguma observação importante..." />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Salvando..." : "Salvar Agendamento"}
        </Button>
      </div>
    </form>
  )
}

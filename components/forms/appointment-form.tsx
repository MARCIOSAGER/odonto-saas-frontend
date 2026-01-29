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

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface AppointmentFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function AppointmentForm({ onSubmit, onCancel, loading }: AppointmentFormProps) {
  const [patients, setPatients] = useState([])
  const [dentists, setDentists] = useState([])
  const [services, setServices] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema)
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, dentistsRes, servicesRes] = await Promise.all([
          api.get("/patients"),
          api.get("/dentists"),
          api.get("/services")
        ])
        setPatients(patientsRes.data?.data || [])
        setDentists(dentistsRes.data?.data || [])
        setServices(servicesRes.data?.data || [])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast.error("Erro ao carregar dados do formulário")
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  if (loadingData) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Paciente</label>
          <select
            {...register("pacienteId")}
            className="w-full h-10 rounded-md border border-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Selecione um paciente</option>
            {patients.map((p: any) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          {errors.pacienteId && <p className="text-xs text-destructive">{errors.pacienteId.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dentista</label>
          <select
            {...register("dentistaId")}
            className="w-full h-10 rounded-md border border-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Selecione um dentista</option>
            {dentists.map((d: any) => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>
          {errors.dentistaId && <p className="text-xs text-destructive">{errors.dentistaId.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Serviço</label>
          <select
            {...register("servicoId")}
            className="w-full h-10 rounded-md border border-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Data</label>
            <Input type="date" {...register("data")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            {errors.data && <p className="text-xs text-destructive">{errors.data.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hora</label>
            <Input type="time" {...register("hora")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
            {errors.hora && <p className="text-xs text-destructive">{errors.hora.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Observações</label>
          <Textarea {...register("observacoes")} placeholder="Alguma observação importante..." className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="text-gray-700 dark:text-gray-300">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[150px]">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Agendamento"
            )}
          </Button>
        </div>
      </form>
  )
}

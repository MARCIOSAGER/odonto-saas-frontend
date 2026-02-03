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
  initialData?: any | null
  prefillDateTime?: { date: string; time: string } | null
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function AppointmentForm({ initialData, prefillDateTime, onSubmit, onCancel, loading }: AppointmentFormProps) {
  const isEditing = !!initialData
  const [patients, setPatients] = useState([])
  const [dentists, setDentists] = useState([])
  const [services, setServices] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: initialData?.patient_id || "",
      dentist_id: initialData?.dentist_id || "",
      service_id: initialData?.service_id || "",
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : (prefillDateTime?.date || ""),
      time: initialData?.time || (prefillDateTime?.time || ""),
      notes: initialData?.notes || ""
    }
  })

  useEffect(() => {
    if (initialData) {
      reset({
        patient_id: initialData.patient_id,
        dentist_id: initialData.dentist_id,
        service_id: initialData.service_id,
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        time: initialData.time || "",
        notes: initialData.notes || ""
      })
    } else if (prefillDateTime) {
      reset({
        patient_id: "",
        dentist_id: "",
        service_id: "",
        date: prefillDateTime.date,
        time: prefillDateTime.time,
        notes: ""
      })
    }
  }, [initialData, prefillDateTime, reset])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, dentistsRes, servicesRes] = await Promise.all([
          api.get("/patients", { params: { limit: 1000 } }),
          api.get("/dentists", { params: { limit: 1000 } }),
          api.get("/services")
        ])
        // Unwrap TransformInterceptor + pagination: { success, data: { data: [...], meta }, timestamp }
        const extractArray = (res: any) => {
          const payload = res.data?.data || res.data
          if (Array.isArray(payload)) return payload
          if (Array.isArray(payload?.data)) return payload.data
          return []
        }
        setPatients(extractArray(patientsRes))
        setDentists(extractArray(dentistsRes))
        setServices(extractArray(servicesRes))
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast.error("Erro ao carregar dados do formulário")
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  const handleFormSubmit = (data: AppointmentInput) => {
    // Backend espera date (YYYY-MM-DD) e time (HH:MM) separados
    const formattedData: any = {
      patient_id: data.patient_id,
      dentist_id: data.dentist_id || undefined,
      service_id: data.service_id,
      date: data.date,
      time: data.time,
      notes: data.notes || undefined,
    }
    onSubmit(formattedData)
  }

  if (loadingData) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Paciente</label>
        <select
          {...register("patient_id")}
          className="w-full h-10 rounded-md border border-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Selecione um paciente</option>
          {patients.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name || p.nome}</option>
          ))}
        </select>
        {errors.patient_id && <p className="text-xs text-destructive">{errors.patient_id.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dentista</label>
        <select
          {...register("dentist_id")}
          className="w-full h-10 rounded-md border border-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Selecione um dentista</option>
          {dentists.map((d: any) => (
            <option key={d.id} value={d.id}>{d.name || d.nome}</option>
          ))}
        </select>
        {errors.dentist_id && <p className="text-xs text-destructive">{errors.dentist_id.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Serviço</label>
        <select
          {...register("service_id")}
          className="w-full h-10 rounded-md border border-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Selecione um serviço</option>
          {services.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name || s.nome} - R$ {s.price || s.preco}</option>
          ))}
        </select>
        {errors.service_id && <p className="text-xs text-destructive">{errors.service_id.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Data</label>
          <Input type="date" {...register("date")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hora</label>
          <Input type="time" {...register("time")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          {errors.time && <p className="text-xs text-destructive">{errors.time.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Observações</label>
        <Textarea {...register("notes")} placeholder="Alguma observação importante..." className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
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
              isEditing ? "Atualizar" : "Cadastrar"
            )}
          </Button>
        </div>
      </form>
  )
}

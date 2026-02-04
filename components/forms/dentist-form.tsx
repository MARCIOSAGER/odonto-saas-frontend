"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { dentistSchema, DentistInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface DentistFormProps {
  initialData?: any | null
  onSubmit: (data: any) => void
  onCancel: () => void
  loading?: boolean
}

export function DentistForm({ initialData, onSubmit, onCancel, loading }: DentistFormProps) {
  const t = useTranslations("dentists")
  const tc = useTranslations("common")
  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DentistInput>({
    resolver: zodResolver(dentistSchema),
    defaultValues: initialData || {
      name: "",
      cro: "",
      specialty: "",
      phone: "",
      email: ""
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("fullName")}</label>
        <Input {...register("name")} placeholder={t("namePlaceholder")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("cro")}</label>
          <Input {...register("cro")} placeholder={t("croPlaceholder")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          {errors.cro && <p className="text-xs text-destructive">{errors.cro.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("specialty")}</label>
          <Input {...register("specialty")} placeholder={t("specialtyPlaceholder")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
          {errors.specialty && <p className="text-xs text-destructive">{errors.specialty.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tc("phone")}</label>
        <Input {...register("phone")} placeholder={t("phonePlaceholder")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tc("email")}</label>
        <Input type="email" {...register("email")} placeholder={t("emailPlaceholder")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="text-gray-700 dark:text-gray-300">
          {tc("cancel")}
        </Button>
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tc("saving")}
            </>
          ) : (
            isEditing ? tc("update") : tc("register")
          )}
        </Button>
      </div>
    </form>
  )
}

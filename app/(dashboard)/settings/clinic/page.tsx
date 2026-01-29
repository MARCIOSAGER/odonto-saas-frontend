"use client"
import { useState, useEffect } from "react"
import { useClinic } from "@/hooks/useClinic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Palette, Building2, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function ClinicSettingsPage() {
  const { clinic, isLoading, updateClinic } = useClinic()
  const [isUploading, setIsLoading] = useState(false)

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      cnpj: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      primary_color: "#0EA5E9",
      secondary_color: "#64748B",
      logo_url: ""
    }
  })

  const primaryColor = watch("primary_color")
  const secondaryColor = watch("secondary_color")
  const logoUrl = watch("logo_url")

  useEffect(() => {
    if (clinic) {
      reset({
        name: clinic.name || "",
        cnpj: clinic.cnpj || "",
        phone: clinic.phone || "",
        email: clinic.email || "",
        address: clinic.address || "",
        city: clinic.city || "",
        state: clinic.state || "",
        zip_code: clinic.zip_code || "",
        primary_color: clinic.primary_color || "#0EA5E9",
        secondary_color: clinic.secondary_color || "#64748B",
        logo_url: clinic.logo_url || ""
      })
      // Aplicar cores iniciais
      document.documentElement.style.setProperty('--primary', clinic.primary_color || "#0EA5E9")
      document.documentElement.style.setProperty('--secondary', clinic.secondary_color || "#64748B")
    }
  }, [clinic, reset])

  const handleColorChange = (type: 'primary' | 'secondary', color: string) => {
    setValue(type === 'primary' ? 'primary_color' : 'secondary_color', color)
    document.documentElement.style.setProperty(`--${type}`, color)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setIsLoading(true)
    try {
      const res = await api.post("/clinics/my/upload-logo", formData)
      const newLogoUrl = res.data?.data?.url
      if (newLogoUrl) {
        setValue("logo_url", newLogoUrl)
        toast.success("Logo atualizada com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao fazer upload da logo")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      // Apenas campos válidos para o backend
      const payload = {
        name: data.name,
        cnpj: data.cnpj,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        logo_url: data.logo_url
      }
      await updateClinic.mutateAsync(payload)
      toast.success("Configurações salvas!")
    } catch (error) {
      toast.error("Erro ao salvar configurações")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Minha Clínica</h1>
        <p className="text-sm text-muted-foreground">Personalize a identidade e informações públicas do seu consultório.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        {/* Identidade Visual */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette size={20} className="text-primary" />
              Identidade Visual
            </CardTitle>
            <CardDescription>Defina as cores e logotipos que representam sua marca.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Cor Primária</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="h-10 w-20 rounded border border-border cursor-pointer"
                    />
                    <Input 
                      {...register("primary_color")}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 bg-muted/30 border-none uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Cor Secundária</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={secondaryColor}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="h-10 w-20 rounded border border-border cursor-pointer"
                    />
                    <Input 
                      {...register("secondary_color")}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1 bg-muted/30 border-none uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Logo da Clínica</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 bg-muted/10 gap-2">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-16 object-contain" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <Upload size={24} className="text-muted-foreground" />}
                      </div>
                    )}
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleLogoUpload}
                        disabled={isUploading}
                      />
                      <Button variant="outline" size="sm" className="mt-2 h-8 text-xs" type="button" disabled={isUploading}>
                        Alterar Logo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border">
              <p className="text-sm font-semibold mb-3">Preview do Botão Principal</p>
              <Button type="button" className="bg-primary hover:opacity-90 transition-opacity">
                Botão de Exemplo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações Gerais */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Nome da Clínica</label>
              <Input 
                {...register("name")}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">CNPJ</label>
              <Input 
                {...register("cnpj")}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Telefone de Contato</label>
              <Input 
                {...register("phone")}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <Input 
                {...register("email")}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-foreground">Endereço Completo</label>
              <Input 
                {...register("address")}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 sm:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Cidade</label>
                <Input {...register("city")} className="bg-muted/30 border-none h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Estado</label>
                <Input {...register("state")} className="bg-muted/30 border-none h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">CEP</label>
                <Input {...register("zip_code")} className="bg-muted/30 border-none h-11" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button 
            size="lg" 
            type="submit"
            className="w-full sm:w-auto px-12 gap-2 shadow-lg shadow-primary/20"
            disabled={updateClinic.isPending}
          >
            {updateClinic.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
            Salvar Configurações
          </Button>
        </div>
      </form>
    </div>
  )
}


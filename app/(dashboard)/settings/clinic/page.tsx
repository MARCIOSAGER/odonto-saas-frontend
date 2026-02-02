"use client"
import { useState, useEffect, useRef } from "react"
import { useClinic } from "@/hooks/useClinic"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Palette, Building2, Image as ImageIcon, Type, Link2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { hexToHsl } from "@/lib/colors"
import { getUploadUrl } from "@/lib/api"

export default function ClinicSettingsPage() {
  const { clinic, isLoading, updateClinic } = useClinic()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      cnpj: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      cep: "",
      slug: "",
      primary_color: "#0EA5E9",
      secondary_color: "#64748B",
      logo_display_mode: "logo_name",
    }
  })

  const primaryColor = watch("primary_color")
  const secondaryColor = watch("secondary_color")

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
        cep: clinic.cep || clinic.zip_code || "",
        slug: clinic.slug || "",
        primary_color: clinic.primary_color || "#0EA5E9",
        secondary_color: clinic.secondary_color || "#64748B",
        logo_display_mode: clinic.logo_display_mode || "logo_name",
      })
      if (clinic.logo_url) {
        setLogoPreview(getUploadUrl(clinic.logo_url))
      }
      // Aplicar cores iniciais
      try {
        const primaryHsl = hexToHsl(clinic.primary_color || "#0EA5E9")
        const secondaryHsl = hexToHsl(clinic.secondary_color || "#64748B")
        document.documentElement.style.setProperty('--primary', primaryHsl)
        document.documentElement.style.setProperty('--secondary', secondaryHsl)
      } catch (e) {
        console.error("Erro ao aplicar cores iniciais:", e)
      }
    }
  }, [clinic, reset])

  const handleColorChange = (type: 'primary' | 'secondary', color: string) => {
    setValue(type === 'primary' ? 'primary_color' : 'secondary_color', color)
    try {
      const hsl = hexToHsl(color)
      document.documentElement.style.setProperty(`--${type}`, hsl)
    } catch (e) {
      console.error(`Erro ao converter cor ${type}:`, e)
    }
  }

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida")
      return
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB")
      return
    }

    // Preview local
    const reader = new FileReader()
    reader.onload = (e) => setLogoPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload para o backend
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      // 1. Upload da Logo
      const response = await api.post("/clinics/my/upload-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // 2. Upload também como Favicon (mesma imagem)
      const faviconFormData = new FormData()
      faviconFormData.append("file", file)
      
      await api.post("/clinics/my/upload-favicon", faviconFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // TransformInterceptor wraps: { success, data: { logo_url: "..." }, timestamp }
      const logoData = response.data?.data || response.data
      const newLogoUrl = logoData?.logo_url
      toast.success("Logo e favicon atualizados com sucesso!")
      if (newLogoUrl) {
        const fullUrl = getUploadUrl(newLogoUrl)
        setLogoPreview(fullUrl)
        updateFavicon(fullUrl)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao enviar logo")
      setLogoPreview(clinic?.logo_url ? getUploadUrl(clinic.logo_url) : null)
    } finally {
      setUploading(false)
    }
  }

  // Função para atualizar o favicon dinamicamente
  const updateFavicon = (url: string) => {
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
    if (link) {
      link.href = url
    } else {
      const newLink = document.createElement('link')
      newLink.rel = 'icon'
      newLink.href = url
      document.head.appendChild(newLink)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      // NÃO incluir logo aqui - logo usa endpoint separado
      const profileData = {
        name: data.name,
        cnpj: data.cnpj,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        state: data.state,
        cep: data.cep, // NÃO zip_code
        slug: data.slug || undefined,
        primary_color: data.primary_color,
        secondary_color: data.secondary_color,
        logo_display_mode: data.logo_display_mode,
      }

      // Remover campos undefined/null/vazios
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([_, v]) => v !== undefined && v !== null && v !== "")
      )

      await updateClinic.mutateAsync(cleanData)
      toast.success("Configurações salvas!")
    } catch (error: any) {
      const message = error.response?.data?.message
      toast.error(Array.isArray(message) ? message.join(", ") : message || "Erro ao salvar")
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Minha Clínica</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Personalize a identidade e informações públicas do seu consultório.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
        {/* Identidade Visual */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Palette size={20} className="text-primary" />
              Identidade Visual
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Defina as cores e logotipos que representam sua marca.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cor Primária</label>
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
                      className="flex-1 bg-muted/30 border-none uppercase text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cor Secundária</label>
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
                      className="flex-1 bg-muted/30 border-none uppercase text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Logo da Clínica</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo" 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <span className="text-gray-400 text-sm text-center px-2">Sem logo</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/png,image/jpeg,image/svg+xml" 
                        onChange={handleLogoChange} 
                        className="hidden" 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={uploading} 
                      > 
                        {uploading ? "Enviando..." : "Alterar Logo"} 
                      </Button> 
                      <p className="text-xs text-muted-foreground"> 
                        PNG, JPG ou SVG. Máximo 5MB. 
                      </p> 
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modo de Exibição do Logo na Sidebar */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Exibição no Menu Lateral</label>
              <p className="text-xs text-muted-foreground">Escolha como seu logo e nome aparecem na barra lateral do sistema.</p>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "logo_name", label: "Logo + Nome", icon: <><ImageIcon size={16} /><Type size={14} /></> },
                  { value: "logo_only", label: "Só Logo", icon: <ImageIcon size={18} /> },
                  { value: "name_only", label: "Só Nome", icon: <Type size={18} /> },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("logo_display_mode", option.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      watch("logo_display_mode") === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-1">{option.icon}</div>
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border">
              <p className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">Preview do Botão Principal</p>
              <Button type="button" className="bg-primary hover:opacity-90 transition-opacity">
                Botão de Exemplo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações Gerais */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Building2 size={20} className="text-primary" />
              Informações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nome da Clínica</label>
              <Input 
                {...register("name")}
                className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">CNPJ</label>
              <Input 
                {...register("cnpj")}
                className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Telefone de Contato</label>
              <Input 
                {...register("phone")}
                className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
              <Input 
                {...register("email")}
                className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Link2 size={14} />
                Slug para White-Label
              </label>
              <Input
                {...register("slug")}
                placeholder="minha-clinica"
                className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
              />
              <p className="text-xs text-muted-foreground">
                Usado para login personalizado: <code className="bg-muted px-1 py-0.5 rounded text-xs">/login?clinic=seu-slug</code>. Apenas letras minúsculas, números e hífens.
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Endereço Completo</label>
              <Input 
                {...register("address")}
                className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 sm:col-span-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cidade</label>
                <Input {...register("city")} className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estado</label>
                <Input {...register("state")} className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">CEP</label>
                <Input {...register("cep")} className="bg-muted/30 border-none h-11 text-gray-900 dark:text-gray-100" />
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


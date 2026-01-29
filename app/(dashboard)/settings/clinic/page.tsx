"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Save, Palette, Building2, Share2, Clock, Upload, Globe, Instagram, Facebook } from "lucide-react"

export default function ClinicSettingsPage() {
  const { data: session } = useSession()
  const { success, error: toastError } = useToast()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    cnpj: "",
    phone: "",
    email: "",
    address: "",
    primary_color: "#0EA5E9",
    secondary_color: "#64748B",
    logo_url: "",
    favicon_url: "",
    instagram: "",
    facebook: "",
    website: "",
    working_hours: {
      mon_fri: { start: "08:00", end: "18:00", closed: false },
      sat: { start: "08:00", end: "12:00", closed: false },
      sun: { start: "00:00", end: "00:00", closed: true }
    }
  })

  // Buscar dados da clínica
  const { data: clinic, isLoading } = useQuery({
    queryKey: ["clinic-branding", (session?.user as any)?.clinic_id],
    queryFn: async () => {
      const res = await api.get(`/auth/me`)
      return res.data?.data
    },
    enabled: !!session
  })

  useEffect(() => {
    if (clinic) {
      const data = {
        name: clinic.name || "",
        tagline: clinic.tagline || "",
        cnpj: clinic.cnpj || "",
        phone: clinic.phone || "",
        email: clinic.email || "",
        address: clinic.address || "",
        primary_color: clinic.primary_color || "#0EA5E9",
        secondary_color: clinic.secondary_color || "#64748B",
        logo_url: clinic.logo_url || "",
        favicon_url: clinic.favicon_url || "",
        instagram: clinic.instagram || "",
        facebook: clinic.facebook || "",
        website: clinic.website || "",
        working_hours: clinic.working_hours || formData.working_hours
      }
      setFormData(data)
      // Aplicar cores iniciais
      document.documentElement.style.setProperty('--primary', data.primary_color)
      document.documentElement.style.setProperty('--secondary', data.secondary_color)
    }
  }, [clinic])

  const handleColorChange = (type: 'primary' | 'secondary', color: string) => {
    setFormData(prev => ({ ...prev, [`${type}_color`]: color }))
    document.documentElement.style.setProperty(`--${type}`, color)
  }

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.put(`/clinics/${(session as any)?.user?.clinic_id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-branding"] })
      success("Configurações da clínica salvas com sucesso!")
      // Aplicar cores dinamicamente (simulação imediata)
      document.documentElement.style.setProperty('--primary', formData.primary_color)
    },
    onError: () => toastError("Erro ao salvar configurações")
  })

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

      <div className="grid gap-8">
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
                      value={formData.primary_color}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="h-10 w-20 rounded border border-border cursor-pointer"
                    />
                    <Input 
                      value={formData.primary_color}
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
                      value={formData.secondary_color}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="h-10 w-20 rounded border border-border cursor-pointer"
                    />
                    <Input 
                      value={formData.secondary_color}
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
                    {formData.logo_url ? (
                      <img src={formData.logo_url} alt="Logo" className="h-16 object-contain" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Upload size={24} className="text-muted-foreground" />
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="mt-2 h-8 text-xs">Alterar Logo</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/20 border border-border">
              <p className="text-sm font-semibold mb-3">Preview do Botão Principal</p>
              <Button className="bg-primary hover:opacity-90 transition-opacity">
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Slogan / Tagline</label>
              <Input 
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">CNPJ</label>
              <Input 
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Telefone de Contato</label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-muted/30 border-none h-11"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-foreground">Endereço Completo</label>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-muted/30 border-none h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 size={20} className="text-primary" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Instagram size={14} /> Instagram
              </label>
              <Input 
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@clinica.exemplo"
                className="bg-muted/30 border-none h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Facebook size={14} /> Facebook
              </label>
              <Input 
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="facebook.com/clinica"
                className="bg-muted/30 border-none h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Globe size={14} /> Website
              </label>
              <Input 
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="www.clinica.com.br"
                className="bg-muted/30 border-none h-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Horários */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <WorkingHourRow 
              label="Segunda a Sexta" 
              hours={formData.working_hours.mon_fri} 
              onChange={(h) => setFormData({ ...formData, working_hours: { ...formData.working_hours, mon_fri: h } })}
            />
            <WorkingHourRow 
              label="Sábado" 
              hours={formData.working_hours.sat} 
              onChange={(h) => setFormData({ ...formData, working_hours: { ...formData.working_hours, sat: h } })}
            />
            <WorkingHourRow 
              label="Domingo" 
              hours={formData.working_hours.sun} 
              onChange={(h) => setFormData({ ...formData, working_hours: { ...formData.working_hours, sun: h } })}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-12 gap-2 shadow-lg shadow-primary/20"
            onClick={() => updateMutation.mutate(formData)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}

function WorkingHourRow({ label, hours, onChange }: { label: string; hours: any; onChange: (h: any) => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/10 border border-border">
      <div className="min-w-[150px]">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{hours.closed ? "Fechado" : "Aberto para atendimento"}</p>
      </div>
      <div className="flex items-center gap-3">
        {!hours.closed ? (
          <>
            <Input 
              type="time" 
              value={hours.start} 
              onChange={(e) => onChange({ ...hours, start: e.target.value })}
              className="w-24 bg-white h-9"
            />
            <span className="text-muted-foreground text-xs">até</span>
            <Input 
              type="time" 
              value={hours.end} 
              onChange={(e) => onChange({ ...hours, end: e.target.value })}
              className="w-24 bg-white h-9"
            />
          </>
        ) : (
          <div className="h-9 flex items-center px-4 rounded bg-muted text-muted-foreground text-xs font-medium">
            Estabelecimento Fechado
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className={hours.closed ? "text-primary hover:bg-primary/5" : "text-destructive hover:bg-destructive/5"}
          onClick={() => onChange({ ...hours, closed: !hours.closed })}
        >
          {hours.closed ? "Abrir" : "Fechar"}
        </Button>
      </div>
    </div>
  )
}

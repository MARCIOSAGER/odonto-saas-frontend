"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { api, getUploadUrl } from "@/lib/api"
import { toast } from "sonner"
import {
  Loader2,
  Save,
  Palette,
  Type,
  Image as ImageIcon,
  Upload,
} from "lucide-react"

export default function AdminBrandingPage() {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    platform_name: "Odonto SaaS",
    platform_description: "",
    platform_logo_url: "",
    platform_favicon_url: "",
    platform_primary_color: "#0EA5E9",
    platform_secondary_color: "#10B981",
    platform_hero_title: "",
    platform_hero_subtitle: "",
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get("/system-config/category/platform_branding")
      const items = res.data?.data || res.data || []
      if (Array.isArray(items)) {
        const map: Record<string, string> = {}
        items.forEach((item: any) => { map[item.key] = item.value })
        setForm((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(map).filter(([k]) => k in prev)
          ),
        }))
      }
    } catch {
      toast.error("Erro ao carregar configurações de branding")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleSave() {
    setSaving(true)
    try {
      const configs = Object.entries(form).map(([key, value]) => ({ key, value }))
      await api.put("/system-config/bulk", { configs })
      await queryClient.invalidateQueries({ queryKey: ["platform-branding"] })
      toast.success("Branding salvo com sucesso!")
    } catch {
      toast.error("Erro ao salvar branding")
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(type: "logo" | "favicon", file: File) {
    const setUploading = type === "logo" ? setUploadingLogo : setUploadingFavicon
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const endpoint = type === "logo" ? "/system-config/upload-logo" : "/system-config/upload-favicon"
      const res = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      const url = res.data?.data?.logo_url || res.data?.data?.favicon_url || res.data?.logo_url || res.data?.favicon_url || ""
      if (type === "logo") {
        setForm((p) => ({ ...p, platform_logo_url: url }))
      } else {
        setForm((p) => ({ ...p, platform_favicon_url: url }))
      }
      toast.success(`${type === "logo" ? "Logo" : "Favicon"} enviado!`)
    } catch {
      toast.error(`Erro ao enviar ${type === "logo" ? "logo" : "favicon"}`)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Palette className="h-6 w-6" /> Branding da Plataforma
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalize o nome, logo, cores e textos exibidos na landing page e telas de login.
        </p>
      </div>

      {/* Identidade */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
              <Type className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <CardTitle>Identidade</CardTitle>
              <CardDescription>Nome e descrição exibidos no site.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome da plataforma</label>
              <Input
                value={form.platform_name}
                onChange={(e) => setForm((p) => ({ ...p, platform_name: e.target.value }))}
                placeholder="Odonto SaaS"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <Input
                value={form.platform_description}
                onChange={(e) => setForm((p) => ({ ...p, platform_description: e.target.value }))}
                placeholder="Sistema completo para gestão de clínicas"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo & Favicon */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>Logo & Favicon</CardTitle>
              <CardDescription>Imagens exibidas na navbar, login e aba do navegador.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Logo */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Logo</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg border border-border flex items-center justify-center bg-muted/50 overflow-hidden">
                  {form.platform_logo_url ? (
                    <img src={getUploadUrl(form.platform_logo_url)} alt="Logo" className="h-full w-full object-contain p-1" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleUpload("logo", f)
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Enviar logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou SVG. Max 5MB.</p>
                </div>
              </div>
            </div>

            {/* Favicon */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Favicon</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg border border-border flex items-center justify-center bg-muted/50 overflow-hidden">
                  {form.platform_favicon_url ? (
                    <img src={getUploadUrl(form.platform_favicon_url)} alt="Favicon" className="h-full w-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleUpload("favicon", f)
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadingFavicon}
                  >
                    {uploadingFavicon ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Enviar favicon
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">ICO, PNG ou SVG. Max 1MB.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cores */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
              <Palette className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <CardTitle>Cores</CardTitle>
              <CardDescription>Cores primária e secundária da plataforma.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cor primária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.platform_primary_color}
                  onChange={(e) => setForm((p) => ({ ...p, platform_primary_color: e.target.value }))}
                  className="h-10 w-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={form.platform_primary_color}
                  onChange={(e) => setForm((p) => ({ ...p, platform_primary_color: e.target.value }))}
                  placeholder="#0EA5E9"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cor secundária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.platform_secondary_color}
                  onChange={(e) => setForm((p) => ({ ...p, platform_secondary_color: e.target.value }))}
                  className="h-10 w-10 rounded-lg border border-border cursor-pointer"
                />
                <Input
                  value={form.platform_secondary_color}
                  onChange={(e) => setForm((p) => ({ ...p, platform_secondary_color: e.target.value }))}
                  placeholder="#10B981"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Landing Page */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Type className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle>Landing Page</CardTitle>
              <CardDescription>Textos exibidos na seção hero da página inicial.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Título hero</label>
            <Input
              value={form.platform_hero_title}
              onChange={(e) => setForm((p) => ({ ...p, platform_hero_title: e.target.value }))}
              placeholder="Gestão completa para sua clínica odontológica"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Subtítulo hero</label>
            <Textarea
              value={form.platform_hero_subtitle}
              onChange={(e) => setForm((p) => ({ ...p, platform_hero_subtitle: e.target.value }))}
              placeholder="Agenda, prontuários, financeiro, WhatsApp e inteligência artificial..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Salvar todas as alterações
        </Button>
      </div>
    </div>
  )
}

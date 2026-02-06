"use client"
import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Upload, Image as ImageIcon, ArrowLeftRight } from "lucide-react"
import { useHofPhotos, type HofPhoto } from "@/hooks/useHof"
import { getUploadUrl } from "@/lib/api"
import { formatDate } from "@/lib/format-utils"

interface HofPhotosTabProps {
  patientId: string
}

type PhotoType = "BEFORE" | "AFTER" | "PROGRESS"

export function HofPhotosTab({ patientId }: HofPhotosTabProps) {
  const t = useTranslations("hof")
  const tc = useTranslations("common")

  const { photos, isLoading, upload, isUploading } = useHofPhotos(patientId)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedType, setSelectedType] = useState<PhotoType>("BEFORE")
  const [compareMode, setCompareMode] = useState(false)
  const [beforePhoto, setBeforePhoto] = useState<HofPhoto | null>(null)
  const [afterPhoto, setAfterPhoto] = useState<HofPhoto | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("photo_type", selectedType)

    try {
      await upload(formData)
    } catch {
      // Error handled by hook
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const beforePhotos = photos.filter((p) => p.photo_type === "BEFORE")
  const afterPhotos = photos.filter((p) => p.photo_type === "AFTER")
  const progressPhotos = photos.filter((p) => p.photo_type === "PROGRESS")

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{t("photos.upload")}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompareMode(!compareMode)}
              className="gap-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
              {t("photos.comparison")}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1 max-w-[200px]">
              <label className="text-sm font-medium">Tipo de foto</label>
              <Select
                value={selectedType}
                onValueChange={(v) => setSelectedType(v as PhotoType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEFORE">{t("photos.before")}</SelectItem>
                  <SelectItem value="AFTER">{t("photos.after")}</SelectItem>
                  <SelectItem value="PROGRESS">Progresso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {t("photos.upload")}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Mode */}
      {compareMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("photos.comparison")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Before Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t("photos.before")}</h4>
                {beforePhotos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {beforePhotos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => setBeforePhoto(photo)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          beforePhoto?.id === photo.id
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                        }`}
                      >
                        <img
                          src={getUploadUrl(photo.url)}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("photos.noPhotos")}</p>
                )}
                {beforePhoto && (
                  <img
                    src={getUploadUrl(beforePhoto.url)}
                    alt="Before"
                    className="w-full rounded-lg"
                  />
                )}
              </div>

              {/* After Selection */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">{t("photos.after")}</h4>
                {afterPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {afterPhotos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => setAfterPhoto(photo)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          afterPhoto?.id === photo.id
                            ? "border-primary"
                            : "border-transparent hover:border-muted-foreground"
                        }`}
                      >
                        <img
                          src={getUploadUrl(photo.url)}
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("photos.noPhotos")}</p>
                )}
                {afterPhoto && (
                  <img
                    src={getUploadUrl(afterPhoto.url)}
                    alt="After"
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Grid */}
      {!compareMode && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Before Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Badge variant="secondary">{t("photos.before")}</Badge>
                <span className="text-muted-foreground text-sm">
                  ({beforePhotos.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {beforePhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {beforePhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img
                        src={getUploadUrl(photo.url)}
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-white text-xs">
                          {formatDate(photo.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <p className="text-sm">{t("photos.noPhotos")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* After Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className="bg-green-500">{t("photos.after")}</Badge>
                <span className="text-muted-foreground text-sm">
                  ({afterPhotos.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {afterPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {afterPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img
                        src={getUploadUrl(photo.url)}
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-white text-xs">
                          {formatDate(photo.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <p className="text-sm">{t("photos.noPhotos")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Badge variant="outline">Progresso</Badge>
                <span className="text-muted-foreground text-sm">
                  ({progressPhotos.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progressPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {progressPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img
                        src={getUploadUrl(photo.url)}
                        alt="Progress"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <span className="text-white text-xs">
                          {formatDate(photo.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <p className="text-sm">{t("photos.noPhotos")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

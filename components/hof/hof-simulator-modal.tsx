"use client"

import { useTranslations } from "next-intl"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface HofSimulatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
}

export function HofSimulatorModal({
  open,
  onOpenChange,
  patientId,
}: HofSimulatorModalProps) {
  const t = useTranslations("hof.simulation")

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 w-screen h-screen">
          {/* Header overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/70 to-transparent">
            <DialogPrimitive.Title className="text-white text-lg font-semibold">
              {t("title")}
            </DialogPrimitive.Title>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Simulator iframe */}
          <iframe
            src={`/hof.html?patientId=${patientId}`}
            className="w-full h-full border-0"
            title={t("title")}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

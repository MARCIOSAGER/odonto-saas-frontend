"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FaceogramViewer } from "@/components/hof/faceogram"
import { HofAnamnesisForm } from "@/components/hof/hof-anamnesis-form"
import { HofPhotosTab } from "@/components/hof/hof-photos-tab"
import { HofPlanTab } from "@/components/hof/hof-plan-tab"
import { HofSessionsTab } from "@/components/hof/hof-sessions-tab"
import {
  Smile,
  ClipboardList,
  Camera,
  CalendarCheck,
  ListTodo,
  Wand2,
} from "lucide-react"
import { HofSimulation } from "@/components/hof/simulation"

interface PatientHofTabProps {
  patientId: string
}

type SubTabKey = "faceogram" | "simulation" | "anamnesis" | "photos" | "plan" | "sessions"

export function PatientHofTab({ patientId }: PatientHofTabProps) {
  const t = useTranslations("hof")
  const [activeSubTab, setActiveSubTab] = useState<SubTabKey>("faceogram")

  const subTabs: { key: SubTabKey; label: string; icon: React.ElementType }[] = [
    { key: "faceogram", label: t("faceogram.title"), icon: Smile },
    { key: "simulation", label: t("simulation.title"), icon: Wand2 },
    { key: "anamnesis", label: t("anamnesis.title"), icon: ClipboardList },
    { key: "photos", label: t("photos.title"), icon: Camera },
    { key: "plan", label: t("plan.title"), icon: ListTodo },
    { key: "sessions", label: t("sessions.title"), icon: CalendarCheck },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as SubTabKey)}>
        <TabsList className="grid w-full grid-cols-6">
          {subTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="faceogram" className="mt-6">
          <FaceogramViewer patientId={patientId} />
        </TabsContent>

        <TabsContent value="simulation" className="mt-6">
          <div className="h-[calc(100vh-280px)] min-h-[600px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <HofSimulation patientId={patientId} />
          </div>
        </TabsContent>

        <TabsContent value="anamnesis" className="mt-6">
          <HofAnamnesisForm patientId={patientId} />
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <HofPhotosTab patientId={patientId} />
        </TabsContent>

        <TabsContent value="plan" className="mt-6">
          <HofPlanTab patientId={patientId} />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <HofSessionsTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

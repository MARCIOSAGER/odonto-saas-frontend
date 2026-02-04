"use client"
import {
  CalendarDays,
  Users,
  MessageSquare,
  Brain,
  FileText,
  BarChart3,
  Shield,
  Smartphone,
  Bell,
  Search,
  ClipboardList,
  Star,
} from "lucide-react"
import { useTranslations } from "next-intl"

export function Features() {
  const t = useTranslations("marketing")

  const features = [
    {
      icon: CalendarDays,
      title: t("featureScheduleTitle"),
      description: t("featureScheduleDesc"),
    },
    {
      icon: Users,
      title: t("featurePatientsTitle"),
      description: t("featurePatientsDesc"),
    },
    {
      icon: ClipboardList,
      title: t("featureOdontogramTitle"),
      description: t("featureOdontogramDesc"),
    },
    {
      icon: MessageSquare,
      title: t("featureWhatsappTitle"),
      description: t("featureWhatsappDesc"),
    },
    {
      icon: Brain,
      title: t("featureAiTitle"),
      description: t("featureAiDesc"),
    },
    {
      icon: FileText,
      title: t("featurePrescriptionTitle"),
      description: t("featurePrescriptionDesc"),
    },
    {
      icon: BarChart3,
      title: t("featureReportsTitle"),
      description: t("featureReportsDesc"),
    },
    {
      icon: Bell,
      title: t("featureNotificationsTitle"),
      description: t("featureNotificationsDesc"),
    },
    {
      icon: Star,
      title: t("featureNpsTitle"),
      description: t("featureNpsDesc"),
    },
    {
      icon: Smartphone,
      title: t("featurePwaTitle"),
      description: t("featurePwaDesc"),
    },
    {
      icon: Search,
      title: t("featureSearchTitle"),
      description: t("featureSearchDesc"),
    },
    {
      icon: Shield,
      title: t("featureSecurityTitle"),
      description: t("featureSecurityDesc"),
    },
  ]
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("featuresTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

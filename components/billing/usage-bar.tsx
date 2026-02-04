"use client"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface UsageBarProps {
  label: string
  current: number
  limit: number | null
  percentage: number
}

export function UsageBar({ label, current, limit, percentage }: UsageBarProps) {
  const t = useTranslations("billing")
  const isUnlimited = limit === null
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {current} / {isUnlimited ? t("unlimited") : limit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isAtLimit
              ? "bg-destructive"
              : isNearLimit
              ? "bg-warning"
              : "bg-primary"
          )}
          style={{ width: isUnlimited ? "5%" : `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

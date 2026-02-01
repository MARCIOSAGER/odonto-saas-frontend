import { cn } from "@/lib/utils"

interface UsageBarProps {
  label: string
  current: number
  limit: number | null
  percentage: number
}

export function UsageBar({ label, current, limit, percentage }: UsageBarProps) {
  const isUnlimited = limit === null
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {current} / {isUnlimited ? "Ilimitado" : limit}
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

"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlanCardProps {
  name: string
  displayName: string
  description?: string
  priceMonthly: number
  priceYearly?: number
  isCurrentPlan: boolean
  isPopular?: boolean
  features: string[]
  onSelect?: () => void
  loading?: boolean
  billingCycle: "monthly" | "yearly"
}

export function PlanCard({
  displayName,
  description,
  priceMonthly,
  priceYearly,
  isCurrentPlan,
  isPopular,
  features,
  onSelect,
  loading,
  billingCycle,
}: PlanCardProps) {
  const price =
    billingCycle === "yearly" && priceYearly
      ? Math.round(priceYearly / 12)
      : priceMonthly

  return (
    <Card
      className={cn(
        "relative",
        isPopular && "border-primary shadow-md",
        isCurrentPlan && "ring-2 ring-primary"
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          Mais popular
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Plano atual
        </div>
      )}
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold">{displayName}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div>
          {price === 0 ? (
            <span className="text-3xl font-bold">Grátis</span>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground">R$</span>
              <span className="text-3xl font-bold">{price}</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          )}
        </div>

        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan || loading}
          onClick={onSelect}
        >
          {isCurrentPlan
            ? "Plano atual"
            : loading
            ? "Processando..."
            : price === 0
            ? "Selecionar"
            : "Fazer upgrade"}
        </Button>
      </CardContent>
    </Card>
  )
}

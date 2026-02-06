"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, DollarSign } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
}

interface ServiceSelectorProps {
  services: Service[]
  onSelect: (service: Service) => void
}

export function ServiceSelector({ services, onSelect }: ServiceSelectorProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Escolha o serviço</h2>
        <p className="mt-2 text-gray-600">Selecione o procedimento que deseja agendar</p>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="cursor-pointer border-2 transition-all hover:border-primary hover:shadow-md"
            onClick={() => onSelect(service)}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                {service.description && (
                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {service.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(service.price)}
                  </span>
                </div>
              </div>
              <div className="ml-4 h-6 w-6 rounded-full border-2 border-gray-300" />
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          Nenhum serviço disponível no momento.
        </div>
      )}
    </div>
  )
}

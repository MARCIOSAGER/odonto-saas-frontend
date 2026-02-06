"use client"

import { Card, CardContent } from "@/components/ui/card"
import { User, Users } from "lucide-react"

interface Dentist {
  id: string
  name: string
  specialty: string | null
}

interface DentistSelectorProps {
  dentists: Dentist[]
  onSelect: (dentist: Dentist | null) => void
}

export function DentistSelector({ dentists, onSelect }: DentistSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Escolha o dentista</h2>
        <p className="mt-2 text-gray-600">Selecione um profissional ou deixe-nos escolher</p>
      </div>

      <div className="grid gap-4">
        {/* Any available option */}
        <Card
          className="cursor-pointer border-2 transition-all hover:border-primary hover:shadow-md"
          onClick={() => onSelect(null)}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Qualquer disponível</h3>
              <p className="text-sm text-gray-500">Deixe-nos escolher o melhor horário disponível</p>
            </div>
            <div className="ml-4 h-6 w-6 rounded-full border-2 border-gray-300" />
          </CardContent>
        </Card>

        {/* Individual dentists */}
        {dentists.map((dentist) => (
          <Card
            key={dentist.id}
            className="cursor-pointer border-2 transition-all hover:border-primary hover:shadow-md"
            onClick={() => onSelect(dentist)}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{dentist.name}</h3>
                {dentist.specialty && (
                  <p className="text-sm text-gray-500">{dentist.specialty}</p>
                )}
              </div>
              <div className="ml-4 h-6 w-6 rounded-full border-2 border-gray-300" />
            </CardContent>
          </Card>
        ))}
      </div>

      {dentists.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          Nenhum dentista disponível no momento.
        </div>
      )}
    </div>
  )
}

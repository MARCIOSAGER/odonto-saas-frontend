import { addDays, formatISO } from "date-fns"

export const mockPatients = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Paciente ${i + 1}`,
  phone: "11 99999-9999",
  cpf: `000.000.00${i}-00`,
  email: `paciente${i + 1}@exemplo.com`,
  status: i % 2 === 0 ? "Ativo" : "Inativo"
}))

export const mockDentists = Array.from({ length: 3 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Dentista ${i + 1}`,
  cro: `CRO-${1000 + i}`,
  specialty: ["Ortodontia", "Endodontia", "Clínico Geral"][i % 3],
  status: "Ativo"
}))

export const mockServices = Array.from({ length: 6 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Serviço ${i + 1}`,
  description: "Descrição do serviço",
  price: 150 + i * 50,
  duration: 30 + i * 10
}))

export const mockAppointments = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 1}`,
  date_time: formatISO(addDays(new Date(), i % 7)),
  patient_name: mockPatients[i % mockPatients.length].name,
  dentist_name: mockDentists[i % mockDentists.length].name,
  service_name: mockServices[i % mockServices.length].name,
  status: ["Confirmado", "Pendente", "Cancelado"][i % 3]
}))


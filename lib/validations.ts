import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
})
export type LoginInput = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido" })
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
  confirmPassword: z.string().min(8, { message: "Confirmação é obrigatória" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export const registerSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
  confirmPassword: z.string().min(8, { message: "Confirmação é obrigatória" }),
  clinic_name: z.string().min(3, { message: "Nome da clínica deve ter no mínimo 3 caracteres" }),
  cnpj: z.string().min(11, { message: "CPF ou CNPJ inválido" }).max(18, { message: "CPF ou CNPJ inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }).max(15, { message: "Telefone inválido" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})
export type RegisterInput = z.infer<typeof registerSchema>

export const patientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(8, "Telefone é obrigatório"),
  cpf: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  birth_date: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["Ativo", "Inativo"])
})
export type PatientInput = z.infer<typeof patientSchema>

export const appointmentSchema = z.object({
  patient_id: z.string().min(1, "Paciente é obrigatório"),
  dentist_id: z.string().min(1, "Dentista é obrigatório"),
  service_id: z.string().min(1, "Serviço é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Hora é obrigatória"),
  notes: z.string().optional()
})
export type AppointmentInput = z.infer<typeof appointmentSchema>

export const clinicSchema = z.object({
  name: z.string().min(1),
  cnpj: z.string().min(14),
  phone: z.string().min(8),
  plano: z.string().optional(),
  status: z.enum(["Ativa", "Inativa"])
})
export type ClinicInput = z.infer<typeof clinicSchema>

export const serviceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  duration: z.coerce.number().min(1, "Duração é obrigatória"),
  price: z.coerce.number().min(0, "Preço é obrigatório"),
  description: z.string().optional()
})
export type ServiceInput = z.infer<typeof serviceSchema>

export const dentistSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cro: z.string().min(1, "CRO é obrigatório"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal(""))
})
export type DentistInput = z.infer<typeof dentistSchema>

/**
 * Utility functions for formatting display values
 */

/**
 * Formats a Brazilian phone number for display
 * @param phone - Raw phone string (e.g., "11955555555")
 * @returns Formatted phone (e.g., "(11) 95555-5555") or fallback
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—"
  const digits = phone.replace(/\D/g, "")

  // Brazilian mobile: 11 digits (2 DDD + 9 + 8 digits)
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  // Brazilian landline: 10 digits (2 DDD + 8 digits)
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  // Return original if doesn't match expected format
  return phone
}

/**
 * Formats a Brazilian CPF for display
 * @param cpf - Raw CPF string (e.g., "12345678901")
 * @returns Formatted CPF (e.g., "123.456.789-01") or fallback
 */
export function formatCpf(cpf: string | null | undefined): string {
  if (!cpf || cpf === "---" || cpf === "-" || cpf.trim() === "") {
    return "Não informado"
  }

  const digits = cpf.replace(/\D/g, "")

  // Valid CPF has 11 digits
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  // Return original if doesn't match expected format
  return cpf
}

/**
 * Formats a currency value for display (BRL)
 * @param value - Numeric value
 * @returns Formatted currency string (e.g., "R$ 1.234,56")
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "R$ 0,00"

  const numValue = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(numValue)) return "R$ 0,00"

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue)
}

/**
 * Formats a date for display
 * @param date - Date string or Date object
 * @returns Formatted date (e.g., "06/02/2026")
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—"

  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return "—"

  return new Intl.DateTimeFormat("pt-BR").format(dateObj)
}

/**
 * Formats a datetime for display
 * @param date - Date string or Date object
 * @returns Formatted datetime (e.g., "06/02/2026 14:30")
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—"

  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return "—"

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(dateObj)
}

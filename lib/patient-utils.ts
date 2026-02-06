/**
 * Utilities for patient data normalization and status translation
 */

export type PatientStatus = "active" | "inactive" | "Ativo" | "Inativo"

/**
 * Translates patient status from backend to Portuguese display format
 * @param status - Status from backend (active/inactive) or already translated (Ativo/Inativo)
 * @returns Translated status in Portuguese
 */
export function translatePatientStatus(status: string | undefined): string {
  if (!status) return "Inativo"

  const statusMap: Record<string, string> = {
    active: "Ativo",
    inactive: "Inativo",
    Ativo: "Ativo",
    Inativo: "Inativo",
  }

  return statusMap[status] || "Inativo"
}

/**
 * Gets badge variant based on patient status
 * @param status - Patient status
 * @returns Badge variant (green or gray)
 */
export function getPatientStatusVariant(status: string | undefined): "green" | "gray" {
  const translatedStatus = translatePatientStatus(status)
  return translatedStatus === "Ativo" ? "green" : "gray"
}

/**
 * Normalizes patient name for comparison and storage
 * Removes extra whitespace, converts to lowercase, and normalizes accents
 * @param name - Patient name
 * @returns Normalized name
 */
export function normalizePatientName(name: string | undefined): string {
  if (!name) return ""

  return name
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
}

/**
 * Gets patient display name with fallback
 * @param patient - Patient object
 * @returns Display name
 */
export function getPatientDisplayName(patient: any): string {
  return patient?.name || patient?.nome || "Paciente"
}

/**
 * Gets patient phone with fallback
 * @param patient - Patient object
 * @returns Phone number
 */
export function getPatientPhone(patient: any): string {
  return patient?.phone || patient?.telefone || "---"
}

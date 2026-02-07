/**
 * HOF Zone Definitions
 * 30 facial zones with MediaPipe landmark indices for facial harmonization procedures
 */

export type SimType = 'smooth' | 'lift' | 'volume' | 'brighten' | 'contour' | 'slim'
export type Tercio = 'Terço Superior' | 'Terço Médio' | 'Terço Inferior' | 'Submentoniana'

export interface ZoneDef {
  id: string
  name: string
  tercio: Tercio
  color: string
  simType: SimType
  cx: number // Normalized center X (0-1)
  cy: number // Normalized center Y (0-1)
  rx: number // Normalized radius X
  ry: number // Normalized radius Y
  maxRx?: number
  maxRy?: number
  landmarks: number[] // MediaPipe Face Landmarker indices (468 total)
}

export const ZONE_DEFS: ZoneDef[] = [
  // === TERÇO SUPERIOR ===
  {
    id: 'testa',
    name: 'Testa / Frontal',
    tercio: 'Terço Superior',
    color: '#3b82f6',
    simType: 'smooth',
    cx: 0.50, cy: 0.14, rx: 0.12, ry: 0.03,
    maxRx: 0.14, maxRy: 0.04,
    landmarks: [10, 67, 109, 108, 69, 104, 68, 71, 63, 105, 66, 107, 9, 336, 296, 334, 299, 333, 298, 301, 293, 297]
  },
  {
    id: 'glabela',
    name: 'Glabela',
    tercio: 'Terço Superior',
    color: '#8b5cf6',
    simType: 'smooth',
    cx: 0.50, cy: 0.24, rx: 0.025, ry: 0.018,
    maxRx: 0.035, maxRy: 0.025,
    landmarks: [9, 8, 168, 6, 197, 195, 5]
  },
  {
    id: 'sobrancelha_e',
    name: 'Sobrancelha Esq.',
    tercio: 'Terço Superior',
    color: '#f59e0b',
    simType: 'lift',
    cx: 0.36, cy: 0.26, rx: 0.045, ry: 0.01,
    maxRx: 0.06, maxRy: 0.015,
    landmarks: [70, 63, 105, 66, 107, 55, 65, 52, 53, 46]
  },
  {
    id: 'sobrancelha_d',
    name: 'Sobrancelha Dir.',
    tercio: 'Terço Superior',
    color: '#f59e0b',
    simType: 'lift',
    cx: 0.64, cy: 0.26, rx: 0.045, ry: 0.01,
    maxRx: 0.06, maxRy: 0.015,
    landmarks: [300, 293, 334, 296, 336, 285, 295, 282, 283, 276]
  },
  {
    id: 'temporal_e',
    name: 'Temporal Esq.',
    tercio: 'Terço Superior',
    color: '#ec4899',
    simType: 'volume',
    cx: 0.18, cy: 0.24, rx: 0.025, ry: 0.025,
    maxRx: 0.035, maxRy: 0.035,
    landmarks: [54, 103, 67, 109]
  },
  {
    id: 'temporal_d',
    name: 'Temporal Dir.',
    tercio: 'Terço Superior',
    color: '#ec4899',
    simType: 'volume',
    cx: 0.82, cy: 0.24, rx: 0.025, ry: 0.025,
    maxRx: 0.035, maxRy: 0.035,
    landmarks: [284, 332, 297, 338]
  },
  {
    id: 'pesGalinha_e',
    name: 'Pés de Galinha Esq.',
    tercio: 'Terço Superior',
    color: '#ef4444',
    simType: 'smooth',
    cx: 0.20, cy: 0.33, rx: 0.02, ry: 0.015,
    maxRx: 0.03, maxRy: 0.02,
    landmarks: [130, 247, 30, 29, 27, 28, 56]
  },
  {
    id: 'pesGalinha_d',
    name: 'Pés de Galinha Dir.',
    tercio: 'Terço Superior',
    color: '#ef4444',
    simType: 'smooth',
    cx: 0.80, cy: 0.33, rx: 0.02, ry: 0.015,
    maxRx: 0.03, maxRy: 0.02,
    landmarks: [359, 467, 260, 259, 257, 258, 286]
  },

  // === TERÇO MÉDIO ===
  {
    id: 'bunny_e',
    name: 'Bunny Lines Esq.',
    tercio: 'Terço Médio',
    color: '#06b6d4',
    simType: 'smooth',
    cx: 0.46, cy: 0.38, rx: 0.015, ry: 0.012,
    maxRx: 0.02, maxRy: 0.015,
    landmarks: [193, 122, 196, 3, 51]
  },
  {
    id: 'bunny_d',
    name: 'Bunny Lines Dir.',
    tercio: 'Terço Médio',
    color: '#06b6d4',
    simType: 'smooth',
    cx: 0.54, cy: 0.38, rx: 0.015, ry: 0.012,
    maxRx: 0.02, maxRy: 0.015,
    landmarks: [417, 351, 420, 248, 281]
  },
  {
    id: 'nariz',
    name: 'Nariz (Rinomodelação)',
    tercio: 'Terço Médio',
    color: '#a855f7',
    simType: 'contour',
    cx: 0.50, cy: 0.44, rx: 0.02, ry: 0.035,
    maxRx: 0.025, maxRy: 0.045,
    landmarks: [6, 197, 195, 5, 4, 1, 19, 94, 2, 164, 0, 11, 12, 13, 14, 15, 16, 17, 18, 200]
  },
  {
    id: 'olheira_e',
    name: 'Olheira Esq.',
    tercio: 'Terço Médio',
    color: '#6366f1',
    simType: 'brighten',
    cx: 0.36, cy: 0.36, rx: 0.03, ry: 0.012,
    maxRx: 0.04, maxRy: 0.015,
    landmarks: [111, 117, 118, 119, 120, 121, 128, 245]
  },
  {
    id: 'olheira_d',
    name: 'Olheira Dir.',
    tercio: 'Terço Médio',
    color: '#6366f1',
    simType: 'brighten',
    cx: 0.64, cy: 0.36, rx: 0.03, ry: 0.012,
    maxRx: 0.04, maxRy: 0.015,
    landmarks: [340, 346, 347, 348, 349, 350, 357, 465]
  },
  {
    id: 'malar_e',
    name: 'Malar Esq.',
    tercio: 'Terço Médio',
    color: '#f43f5e',
    simType: 'volume',
    cx: 0.28, cy: 0.42, rx: 0.035, ry: 0.025,
    maxRx: 0.045, maxRy: 0.03,
    landmarks: [116, 123, 147, 187, 207, 206, 205]
  },
  {
    id: 'malar_d',
    name: 'Malar Dir.',
    tercio: 'Terço Médio',
    color: '#f43f5e',
    simType: 'volume',
    cx: 0.72, cy: 0.42, rx: 0.035, ry: 0.025,
    maxRx: 0.045, maxRy: 0.03,
    landmarks: [345, 352, 376, 411, 427, 426, 425]
  },
  {
    id: 'nasogeniano_e',
    name: 'Nasogeniano Esq.',
    tercio: 'Terço Médio',
    color: '#f97316',
    simType: 'smooth',
    cx: 0.41, cy: 0.53, rx: 0.015, ry: 0.025,
    maxRx: 0.02, maxRy: 0.035,
    landmarks: [49, 220, 237, 44, 45, 64]
  },
  {
    id: 'nasogeniano_d',
    name: 'Nasogeniano Dir.',
    tercio: 'Terço Médio',
    color: '#f97316',
    simType: 'smooth',
    cx: 0.59, cy: 0.53, rx: 0.015, ry: 0.025,
    maxRx: 0.02, maxRy: 0.035,
    landmarks: [279, 440, 457, 274, 275, 294]
  },
  {
    id: 'masseter_e',
    name: 'Masseter Esq.',
    tercio: 'Terço Médio',
    color: '#84cc16',
    simType: 'slim',
    cx: 0.22, cy: 0.52, rx: 0.03, ry: 0.035,
    maxRx: 0.04, maxRy: 0.045,
    landmarks: [116, 117, 118, 100, 36, 142, 126, 217]
  },
  {
    id: 'masseter_d',
    name: 'Masseter Dir.',
    tercio: 'Terço Médio',
    color: '#84cc16',
    simType: 'slim',
    cx: 0.78, cy: 0.52, rx: 0.03, ry: 0.035,
    maxRx: 0.04, maxRy: 0.045,
    landmarks: [345, 346, 347, 329, 266, 371, 355, 437]
  },

  // === TERÇO INFERIOR ===
  {
    id: 'sorrisoGengival',
    name: 'Sorriso Gengival',
    tercio: 'Terço Inferior',
    color: '#14b8a6',
    simType: 'smooth',
    cx: 0.50, cy: 0.57, rx: 0.04, ry: 0.012,
    landmarks: [164, 167, 165, 92, 186, 57, 43, 106, 182, 83, 18, 313, 406, 335, 273, 287, 410, 322, 391, 393]
  },
  {
    id: 'labioSup',
    name: 'Lábio Superior',
    tercio: 'Terço Inferior',
    color: '#e11d48',
    simType: 'volume',
    cx: 0.50, cy: 0.59, rx: 0.035, ry: 0.012,
    maxRx: 0.04, maxRy: 0.015,
    landmarks: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191]
  },
  {
    id: 'labioInf',
    name: 'Lábio Inferior',
    tercio: 'Terço Inferior',
    color: '#e11d48',
    simType: 'volume',
    cx: 0.50, cy: 0.63, rx: 0.035, ry: 0.012,
    maxRx: 0.04, maxRy: 0.015,
    landmarks: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95]
  },
  {
    id: 'codigoBarras',
    name: 'Código de Barras',
    tercio: 'Terço Inferior',
    color: '#78716c',
    simType: 'smooth',
    cx: 0.50, cy: 0.57, rx: 0.04, ry: 0.008,
    maxRx: 0.05, maxRy: 0.012,
    landmarks: [164, 167, 165, 92, 186, 57, 43, 106, 182, 83, 18, 313, 406, 335, 273, 287, 410, 322, 391, 393]
  },
  {
    id: 'marionete_e',
    name: 'Marionete Esq.',
    tercio: 'Terço Inferior',
    color: '#d946ef',
    simType: 'smooth',
    cx: 0.39, cy: 0.66, rx: 0.015, ry: 0.015,
    maxRx: 0.02, maxRy: 0.02,
    landmarks: [61, 146, 91, 181, 84, 43, 106]
  },
  {
    id: 'marionete_d',
    name: 'Marionete Dir.',
    tercio: 'Terço Inferior',
    color: '#d946ef',
    simType: 'smooth',
    cx: 0.61, cy: 0.66, rx: 0.015, ry: 0.015,
    maxRx: 0.02, maxRy: 0.02,
    landmarks: [291, 375, 321, 405, 314, 273, 335]
  },
  {
    id: 'mento',
    name: 'Mento / Queixo',
    tercio: 'Terço Inferior',
    color: '#0ea5e9',
    simType: 'volume',
    cx: 0.50, cy: 0.72, rx: 0.035, ry: 0.02,
    maxRx: 0.045, maxRy: 0.025,
    landmarks: [152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152]
  },
  {
    id: 'jawline_e',
    name: 'Jawline Esq.',
    tercio: 'Terço Inferior',
    color: '#eab308',
    simType: 'contour',
    cx: 0.27, cy: 0.65, rx: 0.035, ry: 0.018,
    maxRx: 0.045, maxRy: 0.025,
    landmarks: [132, 58, 172, 136, 150, 149, 176, 148, 152]
  },
  {
    id: 'jawline_d',
    name: 'Jawline Dir.',
    tercio: 'Terço Inferior',
    color: '#eab308',
    simType: 'contour',
    cx: 0.73, cy: 0.65, rx: 0.035, ry: 0.018,
    maxRx: 0.045, maxRy: 0.025,
    landmarks: [361, 288, 397, 365, 379, 378, 400, 377, 152]
  },

  // === SUBMENTONIANA ===
  {
    id: 'papada',
    name: 'Papada',
    tercio: 'Submentoniana',
    color: '#a3a3a3',
    simType: 'slim',
    cx: 0.50, cy: 0.80, rx: 0.04, ry: 0.018,
    maxRx: 0.05, maxRy: 0.025,
    landmarks: [152, 377, 400, 378, 379, 365, 397, 288, 361, 323, 454, 356, 389, 251, 284]
  },
  {
    id: 'pescoco',
    name: 'Pescoço / Platisma',
    tercio: 'Submentoniana',
    color: '#737373',
    simType: 'smooth',
    cx: 0.50, cy: 0.88, rx: 0.06, ry: 0.025,
    maxRx: 0.07, maxRy: 0.03,
    landmarks: [152, 148, 176, 149, 150, 136, 172, 58, 132]
  }
]

/**
 * Get zones grouped by tercio for sidebar rendering
 */
export function getZonesByTercio(): Record<Tercio, ZoneDef[]> {
  return ZONE_DEFS.reduce((acc, zone) => {
    if (!acc[zone.tercio]) {
      acc[zone.tercio] = []
    }
    acc[zone.tercio].push(zone)
    return acc
  }, {} as Record<Tercio, ZoneDef[]>)
}

/**
 * Get zone by ID
 */
export function getZoneById(id: string): ZoneDef | undefined {
  return ZONE_DEFS.find(z => z.id === id)
}

/**
 * Procedure type icons (emoji) for display
 */
export const PROCEDURE_ICONS: Record<string, string> = {
  botox: '💉',
  dysport: '💉',
  xeomin: '💉',
  ah: '💧',
  hidroxiapatita: '💧',
  plla: '💧',
  pcl: '💧',
  pdo_liso: '🧵',
  pdo_espiculado: '🧵',
  pdo_mola: '🧵',
  skinbooster: '✨',
  bioestimulador: '🔬',
  peeling: '🧪',
  laser: '⚡',
  microagulhamento: '📌',
  lipolise: '🔥'
}

/**
 * Procedure type display names
 */
export const PROCEDURE_NAMES: Record<string, string> = {
  botox: 'Botox',
  dysport: 'Dysport',
  xeomin: 'Xeomin',
  ah: 'Ácido Hialurônico',
  hidroxiapatita: 'Radiesse',
  plla: 'Sculptra',
  pcl: 'Ellansé',
  pdo_liso: 'Fio PDO Liso',
  pdo_espiculado: 'Fio PDO Espiculado',
  pdo_mola: 'Fio PDO Mola',
  skinbooster: 'Skinbooster',
  bioestimulador: 'Bioestimulador',
  peeling: 'Peeling',
  laser: 'Laser/IPL',
  microagulhamento: 'Microagulhamento',
  lipolise: 'Lipólise'
}

/**
 * Map zone ID to backend FacialRegion enum
 */
export function mapZoneToFacialRegion(zoneId: string): string {
  const mapping: Record<string, string> = {
    // Terço Superior
    testa: 'TESTA',
    glabela: 'GLABELA',
    sobrancelha_e: 'TESTA',
    sobrancelha_d: 'TESTA',
    temporal_e: 'TEMPORAL',
    temporal_d: 'TEMPORAL',
    pesGalinha_e: 'PERIORBICULAR',
    pesGalinha_d: 'PERIORBICULAR',
    // Terço Médio
    bunny_e: 'NARIZ',
    bunny_d: 'NARIZ',
    nariz: 'NARIZ',
    olheira_e: 'PERIORBICULAR',
    olheira_d: 'PERIORBICULAR',
    malar_e: 'MALAR',
    malar_d: 'MALAR',
    nasogeniano_e: 'SULCO_NASOGENIANO',
    nasogeniano_d: 'SULCO_NASOGENIANO',
    masseter_e: 'MANDIBULA',
    masseter_d: 'MANDIBULA',
    // Terço Inferior
    sorrisoGengival: 'LABIO_SUPERIOR',
    labioSup: 'LABIO_SUPERIOR',
    labioInf: 'LABIO_INFERIOR',
    codigoBarras: 'LABIO_SUPERIOR',
    marionete_e: 'LABIO_INFERIOR',
    marionete_d: 'LABIO_INFERIOR',
    mento: 'MENTO',
    jawline_e: 'MANDIBULA',
    jawline_d: 'MANDIBULA',
    // Submentoniana
    papada: 'MENTO',
    pescoco: 'MENTO'
  }
  return mapping[zoneId] || 'MALAR'
}

/**
 * Map procedure type to backend HofProcedureType enum
 */
export function mapProcedureToHofType(procedureType: string): string {
  const mapping: Record<string, string> = {
    // Toxinas
    botox: 'TOXINA_BOTULINICA',
    dysport: 'TOXINA_BOTULINICA',
    xeomin: 'TOXINA_BOTULINICA',
    // Preenchimentos
    ah: 'PREENCHIMENTO_HA',
    hidroxiapatita: 'PREENCHIMENTO_HA',
    // Bioestimuladores
    plla: 'BIOESTIMULADOR_COLAGENO',
    pcl: 'BIOESTIMULADOR_COLAGENO',
    bioestimulador: 'BIOESTIMULADOR_COLAGENO',
    // Fios
    pdo_liso: 'FIOS_PDO',
    pdo_espiculado: 'FIOS_PDO',
    pdo_mola: 'FIOS_PDO',
    // Skinbooster
    skinbooster: 'SKINBOOSTER',
    // Outros
    peeling: 'OUTRO',
    laser: 'OUTRO',
    microagulhamento: 'OUTRO',
    lipolise: 'OUTRO'
  }
  return mapping[procedureType] || 'OUTRO'
}

/**
 * Procedure options grouped by category for select dropdown
 */
export const PROCEDURE_OPTIONS = [
  {
    label: 'Toxina Botulínica',
    options: [
      { value: 'botox', label: 'Botox (onabotulinumtoxinA)' },
      { value: 'dysport', label: 'Dysport (abobotulinumtoxinA)' },
      { value: 'xeomin', label: 'Xeomin (incobotulinumtoxinA)' }
    ]
  },
  {
    label: 'Preenchimento',
    options: [
      { value: 'ah', label: 'Ácido Hialurônico' },
      { value: 'hidroxiapatita', label: 'Hidroxiapatita de Cálcio (Radiesse)' },
      { value: 'plla', label: 'PLLA (Sculptra)' },
      { value: 'pcl', label: 'PCL (Ellansé)' }
    ]
  },
  {
    label: 'Fios',
    options: [
      { value: 'pdo_liso', label: 'Fio PDO Liso' },
      { value: 'pdo_espiculado', label: 'Fio PDO Espiculado' },
      { value: 'pdo_mola', label: 'Fio PDO Mola' }
    ]
  },
  {
    label: 'Outros',
    options: [
      { value: 'skinbooster', label: 'Skinbooster' },
      { value: 'bioestimulador', label: 'Bioestimulador' },
      { value: 'peeling', label: 'Peeling Químico' },
      { value: 'laser', label: 'Laser / Luz Pulsada' },
      { value: 'microagulhamento', label: 'Microagulhamento' },
      { value: 'lipolise', label: 'Lipólise Enzimática' }
    ]
  }
]

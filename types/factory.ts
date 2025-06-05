export interface Factory {
  id: number
  name: string
  visualIcon: React.ReactNode // Larger icon for visual representation
  effectType: string // e.g., "Standard Output", "Quality Focus"
  selectedGoodId: string | null
  level: number
  baseProductionTime: number // ms
  productionProgress: number
  lastSaleTime: number
  isLocked: boolean
  unlockConditionText: string
  color: string
}
export interface Goods {
  id: string
  name: string
  icon: React.ReactNode
  basePrice: number
  requiredResources: { resourceId: number; amount: number }[]
  researchId?: string // If this good needs to be researched
}
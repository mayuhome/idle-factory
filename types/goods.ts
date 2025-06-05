export interface Goods {
  id: string
  name: string
  icon: React.ReactNode
  basePrice: number
  requiredResources: { resourceId: string; amount: number }[]
  researchId?: string // If this good needs to be researched
}
export interface Mine {
  id: string
  name: string // Randomly generated
  producesResourceId: string
  productionRate: number // units per second
  level: number
  icon: React.ReactNode
  color: string
}
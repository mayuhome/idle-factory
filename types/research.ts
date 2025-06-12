export interface ResearchItem {
  id: string
  name: string
  description: string
  icon: any,// React.ReactNode
  cost: { type: "money" | "mana" | "resource"; id?: string; amount: number }[]
  type: "good" | "enhancement"
  isResearched: boolean
  unlocksGoodId?: string // For 'good' type research
  enhancementEffect?: string // For 'enhancement' type
}
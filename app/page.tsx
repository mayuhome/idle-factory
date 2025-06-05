"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  Coins,
  Sparkles,
  Globe,
  Users,
  FactoryIcon,
  Package,
  Gem,
  Leaf,
  Mountain,
  Star,
  ChevronDown,
  Lightbulb,
  Construction,
  Pickaxe,
  FlaskConical,
  ShoppingCart,
  Settings2,
  BookOpen,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { RawResource } from '@/types/raw-resource'
import { Goods } from '@/types/goods'
import { Factory } from '@/types/factory'
import { Mine } from '@/types/mine'
import { ResearchItem } from '@/types/research'
import { renderProductionPage } from './production/page'

// --- Helper Functions ---
const generateRandomMineName = () => {
  const prefixes = ["Crystal", "Iron", "Deep", "Sunken", "Forgotten", "Azure", "Ruby", "Emerald"]
  const suffixes = ["Vein", "Quarry", "Depths", "Hollow", "Cavern", "Ridge", "Expanse"]
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
}

const initialRawResources: RawResource[] = [
  { id: "ore", name: "Raw Ore", icon: <Mountain className="w-4 h-4" />, amount: 100, color: "text-gray-400" },
  { id: "crystal", name: "Crystal Shard", icon: <Gem className="w-4 h-4" />, amount: 50, color: "text-purple-400" },
  { id: "plant_fiber", name: "Plant Fiber", icon: <Leaf className="w-4 h-4" />, amount: 100, color: "text-green-400" },
  { id: "essence", name: "Mystic Essence", icon: <Sparkles className="w-4 h-4" />, amount: 20, color: "text-blue-400" },
  { id: "lumber", name: "Lumber", icon: <Construction className="w-4 h-4" />, amount: 0, color: "text-yellow-600" },
  { id: "stone", name: "Stone", icon: <Pickaxe className="w-4 h-4" />, amount: 0, color: "text-slate-500" },
]

const initialGoods: Goods[] = [
  {
    id: "iron_ingot",
    name: "Iron Ingot",
    icon: <FactoryIcon className="w-5 h-5" />,
    basePrice: 10,
    requiredResources: [{ resourceId: "ore", amount: 2 }],
  },
  {
    id: "crystal_lens",
    name: "Crystal Lens",
    icon: <Gem className="w-5 h-5" />,
    basePrice: 25,
    requiredResources: [
      { resourceId: "crystal", amount: 1 },
      { resourceId: "ore", amount: 1 },
    ],
    researchId: "research_lens_crafting",
  },
  {
    id: "fabric",
    name: "Woven Fabric",
    icon: <Users className="w-5 h-5" />,
    basePrice: 15,
    requiredResources: [{ resourceId: "plant_fiber", amount: 3 }],
  },
]

export default function IdleFactoryGame() {
  const [money, setMoney] = useState(10000)
  const [mana, setMana] = useState(100)
  const [worldLevel, setWorldLevel] = useState(1)
  const [workers, setWorkers] = useState(5) // Simplified for now
  const [activeTab, setActiveTab] = useState("production")

  const [rawResources, setRawResources] = useState<RawResource[]>(initialRawResources)
  const [availableGoods, setAvailableGoods] = useState<Goods[]>(initialGoods.filter((g) => !g.researchId)) // Goods not requiring research

  const [factories, setFactories] = useState<Factory[]>([
    {
      id: 1,
      name: "Assembly Line Alpha",
      visualIcon: <FactoryIcon className="w-12 h-12 text-blue-400" />,
      effectType: "Standard Output",
      selectedGoodId: "iron_ingot",
      level: 1,
      baseProductionTime: 5000,
      productionProgress: 0,
      lastSaleTime: Date.now(),
      isLocked: false,
      unlockConditionText: "",
      color: "border-blue-500",
    },
    {
      id: 2,
      name: "Precision Workshop",
      visualIcon: <Settings2 className="w-12 h-12 text-green-400" />,
      effectType: "Quality Focus",
      selectedGoodId: null,
      level: 1,
      baseProductionTime: 7000,
      productionProgress: 0,
      lastSaleTime: Date.now(),
      isLocked: true,
      unlockConditionText: "Reach World Lvl 2",
      color: "border-green-500",
    },
    {
      id: 3,
      name: "Bulk Processor",
      visualIcon: <Package className="w-12 h-12 text-yellow-400" />,
      effectType: "Mass Production",
      selectedGoodId: null,
      level: 1,
      baseProductionTime: 4000,
      productionProgress: 0,
      lastSaleTime: Date.now(),
      isLocked: true,
      unlockConditionText: "Research 'Advanced Logistics'",
      color: "border-yellow-500",
    },
    {
      id: 4,
      name: "Artisan Guild",
      visualIcon: <Star className="w-12 h-12 text-purple-400" />,
      effectType: "Artisan Craftsmanship",
      selectedGoodId: null,
      level: 1,
      baseProductionTime: 10000,
      productionProgress: 0,
      lastSaleTime: Date.now(),
      isLocked: true,
      unlockConditionText: "Produce 100 Crystal Lenses",
      color: "border-purple-500",
    },
    {
      id: 5,
      name: "Synth Lab",
      visualIcon: <FlaskConical className="w-12 h-12 text-pink-400" />,
      effectType: "Synthetic Goods",
      selectedGoodId: null,
      level: 1,
      baseProductionTime: 8000,
      productionProgress: 0,
      lastSaleTime: Date.now(),
      isLocked: true,
      unlockConditionText: "Unlock 'Mystic Essence' Mine",
      color: "border-pink-500",
    },
    {
      id: 6,
      name: "Eco Factory",
      visualIcon: <Leaf className="w-12 h-12 text-teal-400" />,
      effectType: "Sustainable Production",
      selectedGoodId: null,
      level: 1,
      baseProductionTime: 6000,
      productionProgress: 0,
      lastSaleTime: Date.now(),
      isLocked: true,
      unlockConditionText: "Research 'Eco-Friendly Materials'",
      color: "border-teal-500",
    },
  ])

  const [mines, setMines] = useState<Mine[]>([])
  useEffect(() => {
    // Generate mine names once
    if (mines.length === 0) {
      const mineColors = [
        "border-gray-500",
        "border-purple-500",
        "border-green-500",
        "border-blue-500",
        "border-yellow-600",
        "border-slate-600",
      ]
      const mineIcons = [
        <Pickaxe key="pickaxe" />,
        <Gem key="gem" />,
        <Leaf key="leaf" />,
        <Sparkles key="sparkles" />,
        <Construction key="construction" />,
        <Mountain key="mountain" />,
      ]
      const resourceIds = ["ore", "crystal", "plant_fiber", "essence", "lumber", "stone"]
      setMines(
        Array.from({ length: 6 }).map((_, i) => ({
          id: `mine_${i + 1}`,
          name: generateRandomMineName(),
          producesResourceId: resourceIds[i % resourceIds.length],
          productionRate: 1 + Math.random(), // 1-2 per sec
          level: 1,
          icon: React.cloneElement(mineIcons[i % mineIcons.length], { className: "w-10 h-10" }),
          color: mineColors[i % mineColors.length],
        })),
      )
    }
  }, [mines.length])

  const [researchItems, setResearchItems] = useState<ResearchItem[]>([
    {
      id: "research_lens_crafting",
      name: "Lens Crafting",
      description: "Unlock Crystal Lens production.",
      icon: <Gem className="w-6 h-6" />,
      cost: [
        { type: "money", amount: 500 },
        { type: "resource", id: "ore", amount: 50 },
      ],
      type: "good",
      isResearched: false,
      unlocksGoodId: "crystal_lens",
    },
    {
      id: "research_adv_logistics",
      name: "Advanced Logistics",
      description: "Improves factory efficiency.",
      icon: <Settings2 className="w-6 h-6" />,
      cost: [
        { type: "money", amount: 1000 },
        { type: "mana", amount: 20 },
      ],
      type: "enhancement",
      isResearched: false,
      enhancementEffect: "-10% Production Time",
    },
    {
      id: "research_fiber_weaving",
      name: "Fiber Weaving Tech",
      description: "Unlock Woven Fabric production.",
      icon: <Users className="w-6 h-6" />,
      cost: [
        { type: "money", amount: 300 },
        { type: "resource", id: "plant_fiber", amount: 100 },
      ],
      type: "good",
      isResearched: false,
      unlocksGoodId: "fabric",
    },
    {
      id: "research_faster_drills",
      name: "Faster Drills",
      description: "Increases mine output by 20%.",
      icon: <Pickaxe className="w-6 h-6" />,
      cost: [{ type: "money", amount: 2000 }],
      type: "enhancement",
      isResearched: false,
      enhancementEffect: "+20% Mine Output",
    },
  ])

  // --- Game Logic Effects ---

  // Mine Production
  useEffect(() => {
    const interval = setInterval(() => {
      setRawResources((prev) => {
        const newResources = [...prev]
        mines.forEach((mine) => {
          const resIndex = newResources.findIndex((r) => r.id === mine.producesResourceId)
          if (resIndex !== -1) {
            let productionBoost = 1
            if (researchItems.find((ri) => ri.id === "research_faster_drills" && ri.isResearched)) {
              productionBoost = 1.2
            }
            newResources[resIndex].amount += (mine.productionRate * mine.level * productionBoost) / 10 // per 100ms
          }
        })
        return newResources
      })
    }, 100) // Update every 100ms for smoother resource gain
    return () => clearInterval(interval)
  }, [mines, researchItems])

  // Factory Production & Sales Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFactories((prevFactories) =>
        prevFactories.map((factory) => {
          if (factory.isLocked || !factory.selectedGoodId) return factory

          const good = availableGoods.find((g) => g.id === factory.selectedGoodId)
          if (!good) return factory

          // Check resource requirements
          let canProduce = true
          const tempResources = JSON.parse(JSON.stringify(rawResources)) // Deep copy for check
          for (const req of good.requiredResources) {
            const resIdx = tempResources.findIndex((r) => r.id === req.resourceId)
            if (resIdx === -1 || tempResources[resIdx].amount < req.amount * factory.level) {
              canProduce = false
              break
            }
          }

          if (!canProduce) return { ...factory, productionProgress: 0 } // Reset progress if cannot produce

          let newProgress = factory.productionProgress + 100 / (factory.baseProductionTime / 100)
          let madeSale = false

          if (newProgress >= 100) {
            newProgress = 0 // Reset progress

            // Consume resources
            setRawResources((currentRawResources) => {
              const updatedRawResources = [...currentRawResources]
              for (const req of good.requiredResources) {
                const resIdx = updatedRawResources.findIndex((r) => r.id === req.resourceId)
                if (resIdx !== -1) {
                  updatedRawResources[resIdx].amount -= req.amount * factory.level
                }
              }
              return updatedRawResources
            })

            // Add money
            setMoney((m) => m + good.basePrice * factory.level)
            madeSale = true
          }

          return {
            ...factory,
            productionProgress: newProgress,
            lastSaleTime: madeSale ? Date.now() : factory.lastSaleTime,
          }
        }),
      )
    }, 100)
    return () => clearInterval(interval)
  }, [factories, availableGoods, rawResources]) // Added rawResources dependency

  // --- UI Event Handlers ---
  const handleSelectGood = (factoryId: number, goodId: string | null) => {
    setFactories((prev) =>
      prev.map((f) => (f.id === factoryId ? { ...f, selectedGoodId: goodId, productionProgress: 0 } : f)),
    )
  }

  const handleResearch = (researchId: string) => {
    const item = researchItems.find((r) => r.id === researchId)
    if (!item || item.isResearched) return

    // Check cost
    let canAfford = true
    const tempMoney = money
    const tempMana = mana
    const tempRawResources = JSON.parse(JSON.stringify(rawResources))

    for (const costItem of item.cost) {
      if (costItem.type === "money" && tempMoney < costItem.amount) canAfford = false
      if (costItem.type === "mana" && tempMana < costItem.amount) canAfford = false
      if (costItem.type === "resource") {
        const resIdx = tempRawResources.findIndex((r) => r.id === costItem.id)
        if (resIdx === -1 || tempRawResources[resIdx].amount < costItem.amount) canAfford = false
      }
      if (!canAfford) break
    }

    if (canAfford) {
      // Deduct cost
      for (const costItem of item.cost) {
        if (costItem.type === "money") setMoney((m) => m - costItem.amount)
        if (costItem.type === "mana") setMana((m) => m - costItem.amount)
        if (costItem.type === "resource") {
          setRawResources((prev) =>
            prev.map((r) => (r.id === costItem.id ? { ...r, amount: r.amount - costItem.amount } : r)),
          )
        }
      }
      // Mark as researched
      setResearchItems((prev) => prev.map((r) => (r.id === researchId ? { ...r, isResearched: true } : r)))
      // Unlock good if applicable
      if (item.type === "good" && item.unlocksGoodId) {
        const goodToUnlock = initialGoods.find((g) => g.id === item.unlocksGoodId)
        if (goodToUnlock) {
          setAvailableGoods((prev) => [...prev, goodToUnlock])
        }
      }
      // Apply enhancement (simple version: log for now, real effects need more complex state updates)
      if (item.type === "enhancement") {
        console.log(`Enhancement researched: ${item.name} - ${item.enhancementEffect}`)
        // Example: if it's 'Advanced Logistics', try to unlock factory 3
        if (item.id === "research_adv_logistics") {
          setFactories((prev) =>
            prev.map((f) =>
              f.id === 3 && f.unlockConditionText.includes("Advanced Logistics") ? { ...f, isLocked: false } : f,
            ),
          )
        }
      }
    } else {
      alert("Not enough resources/money/mana to research!")
    }
  }

  // Check factory unlock conditions (simple check, can be expanded)
  useEffect(() => {
    setFactories((prevFactories) =>
      prevFactories.map((factory) => {
        if (!factory.isLocked) return factory
        let unlocked = false
        if (factory.id === 2 && worldLevel >= 2) unlocked = true
        // Add more conditions here based on factory.unlockConditionText
        // e.g., if (factory.id === 3 && researchItems.find(r => r.id === "research_adv_logistics" && r.isResearched)) unlocked = true;

        return unlocked ? { ...factory, isLocked: false } : factory
      }),
    )
  }, [worldLevel, researchItems])

  // --- Render Functions ---
  // const renderProductionPage = () => (
  //   <div className="space-y-6">
  //     {factories.map((factory) => (
  //       <Card
  //         key={factory.id}
  //         className={cn("overflow-hidden", factory.color, factory.isLocked && "opacity-60 bg-slate-800/50")}
  //       >
  //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-black/10">
  //           <div className="flex items-center gap-3">
  //             {factory.visualIcon}
  //             <div>
  //               <CardTitle>
  //                 <span className='text-base text-yellow-500 font-bold'>{factory.name}</span>
  //                  {factory.isLocked && <Lock className="inline w-5 h-5 ml-2 text-red-400" />}
  //               </CardTitle>
  //               <CardDescription>
  //                 {factory.effectType} - Lvl {factory.level}
  //               </CardDescription>
  //             </div>
  //           </div>
  //           {!factory.isLocked && (
  //             <DropdownMenu>
  //               <DropdownMenuTrigger asChild>
  //                 <Button variant="outline" size="sm" className="ml-auto gap-1">
  //                   {factory.selectedGoodId
  //                     ? availableGoods.find((g) => g.id === factory.selectedGoodId)?.name
  //                     : "Select Good"}
  //                   <ChevronDown className="h-4 w-4" />
  //                 </Button>
  //               </DropdownMenuTrigger>
  //               <DropdownMenuContent align="end" className="bg-slate-800 text-white border-slate-700">
  //                 {availableGoods.map((good) => (
  //                   <DropdownMenuItem
  //                     key={good.id}
  //                     onSelect={() => handleSelectGood(factory.id, good.id)}
  //                     className="hover:bg-purple-600 focus:bg-purple-600"
  //                   >
  //                     {good.icon} <span className="ml-2">{good.name}</span>
  //                   </DropdownMenuItem>
  //                 ))}
  //                 <DropdownMenuItem
  //                   onSelect={() => handleSelectGood(factory.id, null)}
  //                   className="text-red-400 hover:bg-red-700 focus:bg-red-700"
  //                 >
  //                   Stop Production
  //                 </DropdownMenuItem>
  //               </DropdownMenuContent>
  //             </DropdownMenu>
  //           )}
  //         </CardHeader>
  //         <CardContent className="p-4">
  //           {factory.isLocked ? (
  //             <div className="text-center py-4">
  //               <p className="text-gray-400">Locked</p>
  //               <p className="text-sm text-gray-500">Unlock: {factory.unlockConditionText}</p>
  //               {/* Basic unlock button for testing, can be removed */}
  //               {/* <Button size="sm" onClick={() => setFactories(fs => fs.map(f => f.id === factory.id ? {...f, isLocked: false} : f))} className="mt-2">Dev Unlock</Button> */}
  //             </div>
  //           ) : (
  //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
  //               <div className="md:col-span-2">
  //                 <p className="text-sm text-gray-400 mb-1">
  //                   Producing:{" "}
  //                   {factory.selectedGoodId
  //                     ? availableGoods.find((g) => g.id === factory.selectedGoodId)?.name
  //                     : "Nothing"}
  //                 </p>
  //                 <Progress value={factory.productionProgress} className="h-3 mb-2" />
  //                 {factory.selectedGoodId && (
  //                   <div>
  //                     <p className="text-xs text-gray-500">Required Resources:</p>
  //                     <ul className="list-disc list-inside text-xs text-gray-500">
  //                       {availableGoods
  //                         .find((g) => g.id === factory.selectedGoodId)
  //                         ?.requiredResources.map((req) => {
  //                           const res = rawResources.find((r) => r.id === req.resourceId)
  //                           const currentAmount = res ? res.amount : 0
  //                           const neededAmount = req.amount * factory.level
  //                           return (
  //                             <li key={req.resourceId} className={cn(currentAmount < neededAmount && "text-red-400")}>
  //                               {res?.name}: {neededAmount} (Have: {Math.floor(currentAmount)})
  //                             </li>
  //                           )
  //                         })}
  //                     </ul>
  //                   </div>
  //                 )}
  //               </div>
  //               <div className="text-center md:text-right">
  //                 <ShoppingCart
  //                   className={cn(
  //                     "w-10 h-10 mx-auto md:mx-0 md:ml-auto mb-1 transition-colors duration-300",
  //                     Date.now() - factory.lastSaleTime < 500 ? "text-green-400 animate-pulse" : "text-gray-600",
  //                   )}
  //                 />
  //                 <p className="text-xs text-gray-500">Buyers Sim</p>
  //                 {Date.now() - factory.lastSaleTime < 10000 &&
  //                   Date.now() - factory.lastSaleTime > 100 && ( // Show for 10s after sale
  //                     <p className="text-sm text-green-400 animate-ping absolute right-4 bottom-4">
  //                       +$
  //                       {(availableGoods.find((g) => g.id === factory.selectedGoodId)?.basePrice || 0) * factory.level}
  //                     </p>
  //                   )}
  //               </div>
  //             </div>
  //           )}
  //         </CardContent>
  //       </Card>
  //     ))}
  //   </div>
  // )

  const renderResourcePage = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mines.map((mine) => {
        const resource = rawResources.find((r) => r.id === mine.producesResourceId)
        return (
          <Card key={mine.id} className={cn("overflow-hidden", mine.color)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-black/10">
              <div className="flex items-center gap-2">
                {React.cloneElement(mine.icon, {
                  className: cn(mine.icon.props.className, resource?.color || "text-gray-300"),
                })}
                <CardTitle className="text-base">{mine.name}</CardTitle>
              </div>
              <span className="text-xs bg-black/20 px-2 py-1 rounded">Lvl {mine.level}</span>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm">
                Produces: <span className={cn(resource?.color)}>{resource?.name}</span>
              </p>
              <p className="text-xs text-gray-400">Rate: {(mine.productionRate * mine.level).toFixed(2)}/sec</p>
              <Button size="sm" className="w-full mt-3 bg-slate-700 hover:bg-slate-600" disabled>
                Upgrade (Soon)
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const renderResearchPage = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Goods Research Panel */}
      <Card className="bg-black/30 border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <FlaskConical /> Goods Research
          </CardTitle>
          <CardDescription>Discover new products for your factories.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto">
          {researchItems
            .filter((r) => r.type === "good")
            .map((item) => (
              <Card key={item.id} className={cn("bg-white/5", item.isResearched && "opacity-50 border-green-500")}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {item.icon} {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                      <div className="text-xs text-yellow-400 mt-1">
                        Cost:{" "}
                        {item.cost
                          .map(
                            (c) =>
                              `${c.amount} ${c.type === "resource" ? rawResources.find((rr) => rr.id === c.id)?.name : c.type}`,
                          )
                          .join(", ")}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleResearch(item.id)}
                      disabled={item.isResearched}
                      className={cn(item.isResearched ? "bg-green-600" : "bg-purple-600 hover:bg-purple-700")}
                    >
                      {item.isResearched ? "Researched" : "Research"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </CardContent>
      </Card>

      {/* Enhancements Research Panel */}
      <Card className="bg-black/30 border-cyan-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Lightbulb /> Enhancements
          </CardTitle>
          <CardDescription>Improve various aspects of your operations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto">
          {researchItems
            .filter((r) => r.type === "enhancement")
            .map((item) => (
              <Card key={item.id} className={cn("bg-white/5", item.isResearched && "opacity-50 border-green-500")}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {item.icon} {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                      <p className="text-xs text-cyan-300 mt-1">Effect: {item.enhancementEffect}</p>
                      <div className="text-xs text-yellow-400 mt-1">
                        Cost:{" "}
                        {item.cost
                          .map(
                            (c) =>
                              `${c.amount} ${c.type === "resource" ? rawResources.find((rr) => rr.id === c.id)?.name : c.type}`,
                          )
                          .join(", ")}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleResearch(item.id)}
                      disabled={item.isResearched}
                      className={cn(item.isResearched ? "bg-green-600" : "bg-cyan-600 hover:bg-cyan-700")}
                    >
                      {item.isResearched ? "Researched" : "Research"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderMainContent = () => {
    switch (activeTab) {
      case "production":
        return renderProductionPage({ rawResources, availableGoods })
      case "resource":
        return renderResourcePage()
      case "research":
        return renderResearchPage()
      // Placeholder for other tabs from previous version
      case "development":
        return <p>Development Page (Content from previous version or new design needed)</p>
      case "equipment":
        return <p>Equipment Page (Content from previous version or new design needed)</p>
      case "employee":
        return <p>Employee Page (Content from previous version or new design needed)</p>
      case "achievements":
        return <p>Achievements Page (Content from previous version or new design needed)</p>
      default:
        return null
    }
  }

  const menuItems = [
    { id: "production", label: "Production", icon: <FactoryIcon className="w-4 h-4" /> },
    { id: "resource", label: "Resources", icon: <Pickaxe className="w-4 h-4" /> },
    { id: "research", label: "Research", icon: <BookOpen className="w-4 h-4" /> },
    // { id: "development", label: "Development", icon: <Hammer className="w-4 h-4" /> }, // Kept for potential future re-integration
    // { id: "equipment", label: "Equipment", icon: <Package className="w-4 h-4" /> },
    // { id: "employee", label: "Employee", icon: <Briefcase className="w-4 h-4" /> },
    // { id: "achievements", label: "Achievements", icon: <Trophy className="w-4 h-4" /> },
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
        <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Idle Factory v2
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              {[
                { icon: <Coins className="w-5 h-5 text-yellow-400" />, value: `$${money.toLocaleString()}` },
                { icon: <Sparkles className="w-5 h-5 text-purple-400" />, value: mana },
                { icon: <Globe className="w-5 h-5 text-blue-400" />, value: `Lvl ${worldLevel}` },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 sm:gap-2 bg-white/10 rounded-lg px-2 py-1 sm:px-3 sm:py-2 backdrop-blur-sm"
                >
                  {item.icon} <span className="font-semibold text-xs sm:text-base">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 flex-grow w-full pb-24">
          {" "}
          {/* Added pb-24 for footer, flex-grow */}
          <aside className="w-full md:w-72 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-fit md:sticky md:top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Raw Materials
            </h2>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {rawResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={resource.color}>{resource.icon}</span>
                    <span className="text-sm">{resource.name}</span>
                  </div>
                  <span className="font-semibold">{Math.floor(resource.amount)}</span>
                </div>
              ))}
            </div>
          </aside>
          <main className="flex-1">{renderMainContent()}</main>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10 z-40">
          <div className="max-w-7xl mx-auto p-3 sm:p-4">
            <nav className="flex items-center justify-center gap-1 sm:gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 sm:flex-none items-center gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm ${activeTab === item.id ? "bg-gradient-to-r from-purple-600 to-pink-600" : "hover:bg-white/10"}`}
                >
                  {item.icon} <span className="hidden sm:inline">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

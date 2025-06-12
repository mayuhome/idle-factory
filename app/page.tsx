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
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { RawResource } from '@/types/raw-resource'
import { Goods } from '@/types/goods'
import { Factory } from '@/types/factory'
import { Mine } from '@/types/mine'
import { ResearchItem } from '@/types/research'
import { renderProductionPage } from './production/page'
import { renderResourcesPage } from './resources/page'
import Footer from './layout/footer'
import { useResourceStore } from './stores/resource-store'



export default function IdleFactoryGame() {
  const [money, setMoney] = useState(10000)
  const [mana, setMana] = useState(100)
  const [worldLevel, setWorldLevel] = useState(1)
  const [activeTab, setActiveTab] = useState("production")

  // 将JSX元素转换为组件引用
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
  const [randomValue, setRandomValue] = useState(0);

  const resources = useResourceStore(state => state.resources)

  useEffect(() => {
    setRandomValue(Math.random());
  }, []);

  const setActiveTabFn = (tab: string) => {
    console.log(`Switching to tab: ${tab}`);
    setActiveTab(tab);
  }

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
                        {React.createElement(item.icon, { className: "w-6 h-6" })} {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                      <div className="text-xs text-yellow-400 mt-1">
                        Cost:{" "}
                        {item.cost
                          .map(
                            (c) =>
                              `${c.amount} ${c.type === "resource" ? resources.find((rr) => rr.id === Number(c.id))?.name : c.type}`,
                          )
                          .join(", ")}
                      </div>
                    </div>
                    {/* <Progress value={progress} max={100}>
                      <Indicator style={{ transform: `translateX(-${100 - progress}%)` }}/>
                    </Progress> */}
                    <Button
                      size="sm"
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
                              `${c.amount} ${c.type === "resource" ? resources.find((rr) => rr.id === Number(c.id))?.name : c.type}`,
                          )
                          .join(", ")}
                      </div>
                    </div>
                    <Button
                      size="sm"
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
    console.log("Rendering main content...");

    switch (activeTab) {
      case "production":
        return renderProductionPage()
      case "resource":
        return renderResourcesPage()
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
          <aside className="w-full md:w-72 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-fit md:sticky md:top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Raw Materials
            </h2>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {resources.map((resource) => (
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
          <div>{randomValue.toString()}</div>
          <main className="flex-1">{renderMainContent()}</main>
        </div>
        <Footer activeTab={activeTab} />
        
      </div>
    </TooltipProvider>
  )
}

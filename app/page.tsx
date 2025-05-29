"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Coins,
  Sparkles,
  Globe,
  Users,
  FactoryIcon,
  Timer,
  TrendingUp,
  Hammer,
  Package,
  Briefcase,
  Trophy,
  ArrowUp,
  Gem,
  Wheat,
  Droplet,
  Zap,
  Flame,
  Leaf,
  Mountain,
  Wind,
  Sun,
  Star,
  Target,
  ChevronDown,
  Lightbulb,
  Construction,
  UsersRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Factory {
  id: number
  name: string
  icon: React.ReactNode
  level: number
  baseProfit: number
  baseCooldown: number
  upgradeCost: number
  isProducing: boolean
  progress: number
  color: string
}

interface Resource {
  name: string
  amount: number
  icon: React.ReactNode
  color: string
}

interface GameSkill {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  cost?: number // Optional: cost to unlock/upgrade
  type: "active" | "passive" | "unlock"
}

interface EquipmentItem {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  stats: string // e.g., "+10% Production Speed"
}

interface Talent {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  skills: string[] // Names of skills this talent provides
  effect: string
}

interface Achievement {
  id: string
  name: string
  description: string
  condition: string
  icon: React.ReactNode
  progress: number // 0-100
  reward: string
}

type BatchUpgradeMultiplier = "1" | "10" | "100" | "max"

export default function IdleFactory() {
  const [money, setMoney] = useState(1000)
  const [mana, setMana] = useState(100)
  const [worldLevel, setWorldLevel] = useState(1)
  const [workers, setWorkers] = useState(5)
  const [activeTab, setActiveTab] = useState("production")
  const [batchUpgradeMultiplier, setBatchUpgradeMultiplier] = useState<BatchUpgradeMultiplier>('1')

  const [resources, setResources] = useState<Resource[]>([
    { name: "Gems", amount: 0, icon: <Gem className="w-4 h-4" />, color: "text-purple-500" },
    { name: "Wheat", amount: 0, icon: <Wheat className="w-4 h-4" />, color: "text-yellow-500" },
    { name: "Water", amount: 0, icon: <Droplet className="w-4 h-4" />, color: "text-blue-500" },
    { name: "Energy", amount: 0, icon: <Zap className="w-4 h-4" />, color: "text-yellow-400" },
    { name: "Fire", amount: 0, icon: <Flame className="w-4 h-4" />, color: "text-red-500" },
    { name: "Wood", amount: 0, icon: <Leaf className="w-4 h-4" />, color: "text-green-500" },
  ])

  const [factories, setFactories] = useState<Factory[]>([
    { id: 1, name: "Gem Mine", icon: <Gem className="w-6 h-6" />, level: 1, baseProfit: 10, baseCooldown: 3000, upgradeCost: 100, isProducing: false, progress: 0, color: "from-purple-500 to-purple-600" },
    { id: 2, name: "Wheat Farm", icon: <Wheat className="w-6 h-6" />, level: 1, baseProfit: 8, baseCooldown: 2500, upgradeCost: 80, isProducing: false, progress: 0, color: "from-yellow-500 to-yellow-600" },
    { id: 3, name: "Water Plant", icon: <Droplet className="w-6 h-6" />, level: 1, baseProfit: 6, baseCooldown: 2000, upgradeCost: 60, isProducing: false, progress: 0, color: "from-blue-500 to-blue-600" },
    { id: 4, name: "Power Station", icon: <Zap className="w-6 h-6" />, level: 1, baseProfit: 12, baseCooldown: 3500, upgradeCost: 120, isProducing: false, progress: 0, color: "from-yellow-400 to-yellow-500" },
    { id: 5, name: "Fire Forge", icon: <Flame className="w-6 h-6" />, level: 1, baseProfit: 15, baseCooldown: 4000, upgradeCost: 150, isProducing: false, progress: 0, color: "from-red-500 to-red-600" },
    { id: 6, name: "Lumber Mill", icon: <Leaf className="w-6 h-6" />, level: 1, baseProfit: 7, baseCooldown: 2200, upgradeCost: 70, isProducing: false, progress: 0, color: "from-green-500 to-green-600" },
    { id: 7, name: "Stone Quarry", icon: <Mountain className="w-6 h-6" />, level: 1, baseProfit: 9, baseCooldown: 2800, upgradeCost: 90, isProducing: false, progress: 0, color: "from-gray-500 to-gray-600" },
    { id: 8, name: "Wind Turbine", icon: <Wind className="w-6 h-6" />, level: 1, baseProfit: 11, baseCooldown: 3200, upgradeCost: 110, isProducing: false, progress: 0, color: "from-cyan-500 to-cyan-600" },
    { id: 9, name: "Solar Panel", icon: <Sun className="w-6 h-6" />, level: 1, baseProfit: 13, baseCooldown: 3600, upgradeCost: 130, isProducing: false, progress: 0, color: "from-orange-500 to-orange-600" },
  ])

  const [activeSkills, setActiveSkills] = useState<GameSkill[]>([
    { id: 'prod_boost_1', name: 'Production Boost', description: 'Increases all factory production by 10% for 30s.', icon: <TrendingUp className="w-5 h-5 text-green-400" />, type: 'active' },
    { id: 'cooldown_redux_1', name: 'Rapid Cycles', description: 'Reduces all factory cooldowns by 15% for 1m.', icon: <Timer className="w-5 h-5 text-blue-400" />, type: 'active' },
  ]);

  const [developmentSkills, setDevelopmentSkills] = useState<{ locked: GameSkill[], unlocked: GameSkill[] }>({
    locked: [
      { id: 'adv_smelting', name: 'Advanced Smelting', description: 'Unlocks Tier 2 metal processing, +20% profit from forges.', icon: <Flame className="w-8 h-8" />, cost: 500, type: 'unlock' },
      { id: 'mana_infusion', name: 'Mana Infusion', description: 'Allows mana to boost factory output by 5% per 10 mana.', icon: <Sparkles className="w-8 h-8" />, cost: 1000, type: 'passive' },
    ],
    unlocked: [
      { id: 'basic_engineering', name: 'Basic Engineering', description: 'Reduces upgrade costs for all factories by 5%.', icon: <Construction className="w-8 h-8" />, type: 'passive' },
    ],
  });
  const [selectedSkill, setSelectedSkill] = useState<GameSkill | null>(null);

  const [equipment, setEquipment] = useState<EquipmentItem[]>([
    { id: 'worker_gloves', name: 'Worker Gloves', description: 'Sturdy gloves for factory workers.', icon: <Briefcase className="w-10 h-10" />, stats: '+5% Worker Efficiency' },
    { id: 'reinforced_gears', name: 'Reinforced Gears', description: 'Improves machinery durability.', icon: <FactoryIcon className="w-10 h-10" />, stats: '-5% Cooldown Time' },
    { id: 'mana_crystal', name: 'Mana Crystal', description: 'A crystal humming with energy.', icon: <Gem className="w-10 h-10" />, stats: '+1 Mana per second' },
  ]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);

  const [talents, setTalents] = useState<Talent[]>([
    { id: 'foreman_fred', name: 'Foreman Fred', icon: <UsersRound className="w-10 h-10 text-orange-400" />, description: 'An experienced foreman.', skills: ['Motivation', 'Efficiency Training'], effect: '+10% all production, -5% upgrade costs' },
    { id: 'scientist_sara', name: 'Scientist Sara', icon: <Lightbulb className="w-10 h-10 text-yellow-300" />, description: 'A brilliant R&D expert.', skills: ['Innovation', 'Automation'], effect: '+15% research speed, unlocks new tech faster' },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_million', name: 'First Million', description: 'Earn your first million dollars.', condition: 'Money >= 1,000,000', icon: <Coins className="w-8 h-8 text-yellow-400" />, progress: money / 10000, reward: '+100 Mana' }, // Progress needs dynamic update
    { id: 'master_builder', name: 'Master Builder', description: 'Upgrade any factory to level 10.', condition: 'Any factory Lvl 10', icon: <Hammer className="w-8 h-8 text-gray-400" />, progress: (factories.find(f => f.level >=10) ? 100 : (Math.max(...factories.map(f => f.level))/10 * 100)), reward: '+5% Global Production' },
  ]);
   // Update achievement progress
   useEffect(() => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === 'first_million') return { ...ach, progress: Math.min(100, (money / 1000000) * 100) };
      if (ach.id === 'master_builder') {
        const maxLevel = Math.max(0, ...factories.map(f => f.level));
        return { ...ach, progress: Math.min(100, (maxLevel / 10) * 100) };
      }
      return ach;
    }));
  }, [money, factories]);


  const calculateProfit = (factory: Factory) => factory.baseProfit * factory.level * (1 + worldLevel * 0.1);
  const calculateCooldown = (factory: Factory) => factory.baseCooldown / (1 + workers * 0.05);

  const startProduction = useCallback((factoryId: number) => {
    setFactories((prev) => prev.map((f) => (f.id === factoryId ? { ...f, isProducing: true, progress: 0 } : f)))
  }, [])

  const upgradeFactory = (factoryId: number, levelsToUpgrade = 1) => {
    setFactories((prevFactories) => {
      const factoryIndex = prevFactories.findIndex((f) => f.id === factoryId);
      if (factoryIndex === -1) return prevFactories;

      const currentFactory = { ...prevFactories[factoryIndex] };
      let totalCost = 0;
      const tempLevel = currentFactory.level;
      let tempUpgradeCost = currentFactory.upgradeCost;
      
      // Calculate total cost for N levels
      for (let i = 0; i < levelsToUpgrade; i++) {
        totalCost += tempUpgradeCost;
        tempUpgradeCost = Math.floor(tempUpgradeCost * 1.5);
      }

      if (money < totalCost) return prevFactories;

      // Apply upgrades
      tempUpgradeCost = currentFactory.upgradeCost; // Reset for actual application
      for (let i = 0; i < levelsToUpgrade; i++) {
        currentFactory.level += 1;
        currentFactory.upgradeCost = Math.floor(tempUpgradeCost * 1.5);
        tempUpgradeCost = currentFactory.upgradeCost;
      }
      
      setMoney((prevMoney) => prevMoney - totalCost);
      setMana((prevMana) => prevMana + 5 * levelsToUpgrade);

      const newFactories = [...prevFactories];
      newFactories[factoryIndex] = currentFactory;
      return newFactories;
    });
  };
  
  const handleBatchUpgrade = () => {
    let upgradesMade = false;
    if (batchUpgradeMultiplier === 'max') {
        setFactories(currentFactories => {
            let tempMoney = money;
            const updatedFactories = currentFactories.map(factory => {
                const factoryCopy = { ...factory };
                let levelsBought = 0;
                while (true) {
                    const costOfNextLevel = factoryCopy.upgradeCost;
                    if (tempMoney >= costOfNextLevel) {
                        tempMoney -= costOfNextLevel;
                        factoryCopy.level += 1;
                        factoryCopy.upgradeCost = Math.floor(costOfNextLevel * 1.5);
                        levelsBought++;
                        upgradesMade = true;
                    } else {
                        break;
                    }
                }
                if (levelsBought > 0) {
                    setMana(prevMana => prevMana + 5 * levelsBought);
                }
                return factoryCopy;
            });
            setMoney(tempMoney);
            return updatedFactories;
        });
    } else {
        const levelsToBuy = Number.parseInt(batchUpgradeMultiplier);
        factories.forEach(factory => {
            // Check cost for N levels
            let costForNLevels = 0;
            let currentSimulatedCost = factory.upgradeCost;
            for (let i = 0; i < levelsToBuy; i++) {
                costForNLevels += currentSimulatedCost;
                currentSimulatedCost = Math.floor(currentSimulatedCost * 1.5);
            }
            if (money >= costForNLevels) {
                 upgradeFactory(factory.id, levelsToBuy);
                 upgradesMade = true; 
                 // Note: upgradeFactory handles setMoney, so money will be reduced for next iteration.
                 // This might not be ideal if we want to check all factories against initial money.
                 // For now, this sequential upgrade is simpler.
            }
        });
    }
    if (upgradesMade) {
        // Potentially trigger a UI update or sound effect
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setFactories((prev) =>
        prev.map((factory) => {
          let updatedFactory = factory;
          if (!factory.isProducing) {
            updatedFactory = { ...factory, isProducing: true, progress: 0 };
          }
      
          const cooldown = calculateCooldown(updatedFactory);
          const newProgress = updatedFactory.progress + 100 / (cooldown / 100);
      
          if (newProgress >= 100) {
            const profit = calculateProfit(updatedFactory);
            setMoney((prevMoney) => prevMoney + profit);
            const resourceIndex = Math.floor((updatedFactory.id - 1) % resources.length);
            setResources((prevResources) =>
              prevResources.map((r, i) => (i === resourceIndex ? { ...r, amount: r.amount + updatedFactory.level } : r)),
            );
            return { ...updatedFactory, progress: 0 }; // Reset progress for next cycle
          }
          return { ...updatedFactory, progress: newProgress };
        }),
      );
    }, 100);
    return () => clearInterval(interval);
  }, [startProduction, resources.length]); // Added resources.length to dependencies if it can change, though unlikely here.

  const menuItems = [
    { id: "production", label: "Production", icon: <FactoryIcon className="w-4 h-4" /> },
    { id: "development", label: "Development", icon: <Hammer className="w-4 h-4" /> },
    { id: "equipment", label: "Equipment", icon: <Package className="w-4 h-4" /> },
    { id: "employee", label: "Employee", icon: <Briefcase className="w-4 h-4" /> },
    { id: "achievements", label: "Achievements", icon: <Trophy className="w-4 h-4" /> },
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case "production":
        return (
          <>
            {/* Active Skills Bar */}
            <div className="mb-4 p-3 bg-black/20 rounded-lg border border-white/10">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">Active Skills</h3>
              <div className="flex gap-3">
                <TooltipProvider>
                {activeSkills.map(skill => (
                  <Tooltip key={skill.id}>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-white/5 hover:bg-white/10 border-purple-500/50 text-purple-400 hover:text-purple-300">
                        {skill.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white border-purple-500">
                      <p className="font-semibold">{skill.name}</p>
                      <p className="text-xs">{skill.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                </TooltipProvider>
              </div>
            </div>

            {/* Batch Upgrade Controls */}
            <div className="mb-4 p-3 bg-black/20 rounded-lg border border-white/10 flex items-center gap-3">
              <h3 className="text-sm font-semibold text-gray-300">Batch Upgrade:</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/5 hover:bg-white/10 border-white/20">
                    x{batchUpgradeMultiplier === 'max' ? 'Max' : batchUpgradeMultiplier} <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 text-white border-slate-700">
                  {(['1', '10', '100', 'max'] as BatchUpgradeMultiplier[]).map(val => (
                    <DropdownMenuItem key={val} onSelect={() => setBatchUpgradeMultiplier(val)} className="hover:bg-purple-600 focus:bg-purple-600">
                      x{val === 'max' ? 'Max' : val}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleBatchUpgrade} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Upgrade Affordable
              </Button>
            </div>

            {/* Factory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {factories.map((factory) => (
                <Card key={factory.id} className="bg-black/30 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all hover:scale-105 hover:shadow-xl">
                  <CardContent className="p-4">
                    <div className={`bg-gradient-to-r ${factory.color} p-3 rounded-lg mb-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">{factory.icon} <h3 className="font-semibold">{factory.name}</h3></div>
                      <span className="text-sm bg-black/20 px-2 py-1 rounded">Lvl {factory.level}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-300"><TrendingUp className="w-4 h-4" />Profit</span><span className="font-semibold text-green-400">${calculateProfit(factory).toFixed(0)}/cycle</span></div>
                      <div className="flex items-center justify-between"><span className="flex items-center gap-1 text-gray-300"><Timer className="w-4 h-4" />Cooldown</span><span className="font-semibold">{(calculateCooldown(factory) / 1000).toFixed(1)}s</span></div>
                      <div className="pt-2"><Progress value={factory.progress} className="h-2 bg-white/10" /></div>
                      <Button onClick={() => upgradeFactory(factory.id)} disabled={money < factory.upgradeCost} className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50" size="sm">
                        <ArrowUp className="w-4 h-4 mr-1" />Upgrade (${factory.upgradeCost})
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        );
      case "development":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Research & Development</h2>
            <h3 className="text-lg font-medium mb-2 text-gray-300">Locked Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {developmentSkills.locked.map(skill => (
                <Card key={skill.id} className="bg-white/5 p-4 text-center hover:bg-white/10 cursor-pointer transition-colors" onClick={() => setSelectedSkill(skill)}>
                  <div className="flex justify-center text-purple-400 mb-2">{skill.icon}</div>
                  <p className="text-sm font-medium">{skill.name}</p>
                  {skill.cost && <p className="text-xs text-yellow-400">Cost: {skill.cost} Mana</p>}
                </Card>
              ))}
            </div>
            <Separator className="my-6 bg-white/10" />
            <h3 className="text-lg font-medium mb-2 text-gray-300">Unlocked Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {developmentSkills.unlocked.map(skill => (
                <Card key={skill.id} className="bg-white/5 p-4 text-center hover:bg-white/10 cursor-pointer transition-colors" onClick={() => setSelectedSkill(skill)}>
                  <div className="flex justify-center text-green-400 mb-2">{skill.icon}</div>
                  <p className="text-sm font-medium">{skill.name}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      case "equipment":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Factory Equipment</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {equipment.map(item => (
                <Card key={item.id} className="bg-white/5 p-4 aspect-square flex flex-col items-center justify-center hover:bg-white/10 cursor-pointer transition-colors" onClick={() => setSelectedEquipment(item)}>
                  <div className="text-cyan-400 mb-2">{item.icon}</div>
                  <p className="text-xs text-center font-medium">{item.name}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      case "employee":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-orange-400">Employee Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {talents.map(talent => (
                <Card key={talent.id} className="bg-white/5 p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    {talent.icon}
                    <h3 className="text-lg font-semibold text-orange-300">{talent.name}</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">{talent.description}</p>
                  <p className="text-xs text-gray-400 mb-1"><strong className="text-orange-200">Skills:</strong> {talent.skills.join(', ')}</p>
                  <p className="text-xs text-gray-400"><strong className="text-orange-200">Effect:</strong> {talent.effect}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      case "achievements":
        return (
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Achievements</h2>
            <div className="space-y-4">
              {achievements.map(ach => (
                <Card key={ach.id} className="bg-white/5 p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-yellow-400">{ach.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-md font-semibold text-yellow-300">{ach.name}</h3>
                      <p className="text-xs text-gray-300 mb-1">{ach.description}</p>
                      <p className="text-xs text-gray-400 mb-1">Condition: {ach.condition}</p>
                      <Progress value={ach.progress} className="h-2 bg-white/10" indicatorClassName="bg-yellow-500" />
                      <p className="text-xs text-green-400 mt-1">Reward: {ach.reward}</p>
                    </div>
                    <div className={`text-2xl font-bold ${ach.progress >= 100 ? 'text-green-500' : 'text-gray-500'}`}>
                        {ach.progress >= 100 ? <Star /> : <Target />}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Idle Factory</h1>
          <div className="flex items-center gap-2 sm:gap-6">
            {[{icon: <Coins className="w-5 h-5 text-yellow-400" />, value: `$${money.toLocaleString()}`},
             {icon: <Sparkles className="w-5 h-5 text-purple-400" />, value: mana},
             {icon: <Globe className="w-5 h-5 text-blue-400" />, value: `Lvl ${worldLevel}`},
             {icon: <Users className="w-5 h-5 text-green-400" />, value: workers}].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1 sm:gap-2 bg-white/10 rounded-lg px-2 py-1 sm:px-4 sm:py-2 backdrop-blur-sm">
                {item.icon} <span className="font-semibold text-xs sm:text-base">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 pb-24"> {/* Added pb-24 for footer spacing */}
        <aside className="w-full md:w-64 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-fit md:sticky md:top-24"> {/* md:sticky and md:top-24 for sticky sidebar */}
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Package className="w-5 h-5" />Resources</h2>
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2"><span className={resource.color}>{resource.icon}</span><span className="text-sm">{resource.name}</span></div>
                <span className="font-semibold">{resource.amount}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          {renderMainContent()}
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10 z-40">
        <div className="max-w-7xl mx-auto p-3 sm:p-4">
          <nav className="flex items-center justify-center gap-1 sm:gap-2">
            {menuItems.map((item) => (
              <Button key={item.id} variant={activeTab === item.id ? "default" : "ghost"} onClick={() => setActiveTab(item.id)}
                className={`flex-1 sm:flex-none items-center gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm ${activeTab === item.id ? "bg-gradient-to-r from-purple-600 to-pink-600" : "hover:bg-white/10"}`}>
                {item.icon} <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </footer>

      {/* Skill Details Dialog */}
      <Dialog open={!!selectedSkill} onOpenChange={(isOpen) => !isOpen && setSelectedSkill(null)}>
        <DialogContent className="bg-slate-800 text-white border-purple-500">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-400">{selectedSkill?.icon} {selectedSkill?.name}</DialogTitle>
            <DialogDescription className="text-gray-300 pt-2">{selectedSkill?.description}</DialogDescription>
          </DialogHeader>
          {selectedSkill?.cost && <p className="text-yellow-400 mt-4">Cost: {selectedSkill.cost} Mana</p>}
          {/* Add unlock button or other actions here */}
          <Button className="mt-4 bg-purple-600 hover:bg-purple-700 w-full">
            {developmentSkills.locked.some(s => s.id === selectedSkill?.id) ? `Unlock (${selectedSkill?.cost} Mana)` : "View Details"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Equipment Details Dialog */}
      <Dialog open={!!selectedEquipment} onOpenChange={(isOpen) => !isOpen && setSelectedEquipment(null)}>
        <DialogContent className="bg-slate-800 text-white border-cyan-500">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cyan-400">{selectedEquipment?.icon} {selectedEquipment?.name}</DialogTitle>
            <DialogDescription className="text-gray-300 pt-2">{selectedEquipment?.description}</DialogDescription>
          </DialogHeader>
          <p className="text-cyan-300 mt-4">Stats: {selectedEquipment?.stats}</p>
          {/* Add equip button or other actions here */}
          <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700 w-full">Equip</Button>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  )
}

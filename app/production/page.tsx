'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Factory } from '@/types/factory';
// import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, FactoryIcon, FlaskConical, Leaf, Package, Settings2, ShoppingCart, Star, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Goods } from '@/types/goods';
import { RawResource } from '@/types/raw-resource';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Indicator } from '@radix-ui/react-progress';

type props = {
  rawResources: RawResource[];
  availableGoods: Goods[];
  factories: Factory[];
};
export const renderProductionPage = ({rawResources, availableGoods, factories}:props) => {
    console.log('init production');
    
  //   const [factories, setFactories] = useState<Factory[]>([
  //   {
  //     id: 1,
  //     name: "Factory Alpha",
  //     visualIcon: <FactoryIcon className="w-12 h-12 text-blue-400" />,
  //     effectType: "Standard Output",
  //     selectedGoodId: "iron_ingot",
  //     level: 1,
  //     baseProductionTime: 5000,
  //     productionProgress: 0,
  //     lastSaleTime: Date.now(),
  //     isLocked: false,
  //     unlockConditionText: "",
  //     color: "border-blue-500",
  //   },
  //   {
  //     id: 2,
  //     name: "Factory Beta",
  //     visualIcon: <Settings2 className="w-12 h-12 text-green-400" />,
  //     effectType: "Quality Focus",
  //     selectedGoodId: null,
  //     level: 1,
  //     baseProductionTime: 7000,
  //     productionProgress: 0,
  //     lastSaleTime: Date.now(),
  //     isLocked: true,
  //     unlockConditionText: "Reach World Lvl 2",
  //     color: "border-green-500",
  //   },
  //   {
  //     id: 3,
  //     name: "Factory Gamma",
  //     visualIcon: <Package className="w-12 h-12 text-yellow-400" />,
  //     effectType: "Mass Production",
  //     selectedGoodId: null,
  //     level: 1,
  //     baseProductionTime: 4000,
  //     productionProgress: 0,
  //     lastSaleTime: Date.now(),
  //     isLocked: true,
  //     unlockConditionText: "Research 'Advanced Logistics'",
  //     color: "border-yellow-500",
  //   },
  //   {
  //     id: 4,
  //     name: "Factory Delta",
  //     visualIcon: <Star className="w-12 h-12 text-purple-400" />,
  //     effectType: "Artisan Craftsmanship",
  //     selectedGoodId: null,
  //     level: 1,
  //     baseProductionTime: 10000,
  //     productionProgress: 0,
  //     lastSaleTime: Date.now(),
  //     isLocked: true,
  //     unlockConditionText: "Produce 100 Crystal Lenses",
  //     color: "border-purple-500",
  //   },
  //   {
  //     id: 5,
  //     name: "Factory Epsilon",
  //     visualIcon: <FlaskConical className="w-12 h-12 text-pink-400" />,
  //     effectType: "Synthetic Goods",
  //     selectedGoodId: null,
  //     level: 1,
  //     baseProductionTime: 8000,
  //     productionProgress: 0,
  //     lastSaleTime: Date.now(),
  //     isLocked: true,
  //     unlockConditionText: "Unlock 'Mystic Essence' Mine",
  //     color: "border-pink-500",
  //   },
  //   {
  //     id: 6,
  //     name: "Factory Zeta",
  //     visualIcon: <Leaf className="w-12 h-12 text-teal-400" />,
  //     effectType: "Sustainable Production",
  //     selectedGoodId: null,
  //     level: 1,
  //     baseProductionTime: 6000,
  //     productionProgress: 0,
  //     lastSaleTime: Date.now(),
  //     isLocked: true,
  //     unlockConditionText: "Research 'Eco-Friendly Materials'",
  //     color: "border-teal-500",
  //   },
  // ]);

    const handleSelectGood = (factoryId: number, goodId: string | null) => {
    // setFactories((prev) =>
    //   prev.map((f) => (f.id === factoryId ? { ...f, selectedGoodId: goodId, productionProgress: 0 } : f)),
    // )
  }
  // console.log('Factories:', factories);
  
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setProgress(Math.random() * 100), 3750);
    setTimeout(() => {
      clearInterval(timer);
    }, 23000);
    // return () => clearInterval(timer);
  }, [])
  
  return (
<div className="space-y-6">
      {factories.map((factory) => (
        <Card
          key={factory.id}
          className={cn("overflow-hidden", factory.color, factory.isLocked && "opacity-60 bg-slate-800/50")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-black/10">
            <div className="flex items-center gap-3">
              {factory.visualIcon}
              <div>
                <CardTitle>
                  <span className='text-base text-yellow-500 font-bold'>{factory.name}</span>
                   {factory.isLocked && <Lock className="inline w-5 h-5 ml-2 text-red-400" />}
                </CardTitle>
                <CardDescription>
                  {factory.effectType} - Lvl {factory.level}
                </CardDescription>
              </div>
            </div>
            {!factory.isLocked && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-auto gap-1">
                    {factory.selectedGoodId
                      ? availableGoods.find((g) => g.id === factory.selectedGoodId)?.name
                      : "Select Good"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 text-white border-slate-700">
                  {availableGoods.map((good) => (
                    <DropdownMenuItem
                      key={good.id}
                      onSelect={() => handleSelectGood(factory.id, good.id)}
                      className="hover:bg-purple-600 focus:bg-purple-600"
                    >
                      {good.icon} <span className="ml-2">{good.name}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    onSelect={() => handleSelectGood(factory.id, null)}
                    className="text-red-400 hover:bg-red-700 focus:bg-red-700"
                  >
                    Stop Production
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardHeader>
          <CardContent className="p-4">
            {factory.isLocked ? (
              <div className="text-center py-4">
                <p className="text-gray-400">Locked</p>
                <p className="text-sm text-gray-500">Unlock: {factory.unlockConditionText}</p>
                {/* Basic unlock button for testing, can be removed */}
                {/* <Button size="sm" onClick={() => setFactories(fs => fs.map(f => f.id === factory.id ? {...f, isLocked: false} : f))} className="mt-2">Dev Unlock</Button> */}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-1">
                    Producing:{" "}
                    {factory.selectedGoodId
                      ? availableGoods.find((g) => g.id === factory.selectedGoodId)?.name
                      : "Nothing"}
                  </p>
                                      <Progress value={progress} max={100}>
                                        {/* <Indicator style={{ transform: `translateX(-${100 - progress}%)` }}/> */}
                                      </Progress>
                  {/* <Progress value={factory.productionProgress} className="h-3 mb-2" /> */}
                  {factory.selectedGoodId && (
                    <div>
                      <p className="text-xs text-gray-500">Required Resources:</p>
                      <ul className="list-disc list-inside text-xs text-gray-500">
                        {availableGoods
                          .find((g) => g.id === factory.selectedGoodId)
                          ?.requiredResources.map((req) => {
                            const res = rawResources.find((r) => r.id === req.resourceId)
                            const currentAmount = res ? res.amount : 0
                            const neededAmount = req.amount * factory.level
                            return (
                              <li key={req.resourceId} className={cn(currentAmount < neededAmount && "text-red-400")}>
                                {res?.name}: {neededAmount} (Have: {Math.floor(currentAmount)})
                              </li>
                            )
                          })}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="text-center md:text-right">
                  <ShoppingCart
                    className={cn(
                      "w-10 h-10 mx-auto md:mx-0 md:ml-auto mb-1 transition-colors duration-300",
                      Date.now() - factory.lastSaleTime < 500 ? "text-green-400 animate-pulse" : "text-gray-600",
                    )}
                  />
                  <p className="text-xs text-gray-500">Buyers Sim</p>
                  {Date.now() - factory.lastSaleTime < 10000 &&
                    Date.now() - factory.lastSaleTime > 100 && ( // Show for 10s after sale
                      <p className="text-sm text-green-400 animate-ping absolute right-4 bottom-4">
                        +$
                        {(availableGoods.find((g) => g.id === factory.selectedGoodId)?.basePrice || 0) * factory.level}
                      </p>
                    )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

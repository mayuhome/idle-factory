'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Factory } from '@/types/factory';
// import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  ChevronDown,
  FactoryIcon,
  FlaskConical,
  Leaf,
  Package,
  Settings2,
  ShoppingCart,
  Star,
  Lock,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Goods } from '@/types/goods';
import { RawResource } from '@/types/raw-resource';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Indicator } from '@radix-ui/react-progress';
import { addResource, useResourceStore } from '../stores/resource-store';
import { useFactoryStore } from '../stores/factory-store';
import { useGoodsStore } from '../stores/goods-store';

export const renderProductionPage = () => {
  console.log('init production');

  const resources = useResourceStore((state) => state.resources);
  const factories = useFactoryStore((state) => state.factories);
  const goods = useGoodsStore((state) => state.goods);

  const handleSelectGood = (factoryId: number, goodId: string | null) => {
    // setFactories((prev) =>
    //   prev.map((f) => (f.id === factoryId ? { ...f, selectedGoodId: goodId, productionProgress: 0 } : f)),
    // )
  };

  const clickCard = () => {
    console.log('Card clicked');
    addResource(1, 10);
  }

  return (
    <div className="space-y-6">
      {factories.map((factory) => (
        <Card
          key={factory.id}
          className={cn(
            'overflow-hidden',
            factory.color,
            factory.isLocked && 'opacity-60 bg-slate-800/50'
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-black/10" onClick={clickCard}>
            <div className="flex items-center gap-3">
              {factory.visualIcon}
              <div>
                <CardTitle>
                  <span className="text-base text-yellow-500 font-bold">
                    {factory.name}
                  </span>
                  {factory.isLocked && (
                    <Lock className="inline w-5 h-5 ml-2 text-red-400" />
                  )}
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
                      ? goods.find((g) => g.id === factory.selectedGoodId)?.name
                      : 'Select Good'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-800 text-white border-slate-700"
                >
                  {goods.map((good) => (
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
                <p className="text-sm text-gray-500">
                  Unlock: {factory.unlockConditionText}
                </p>
                {/* Basic unlock button for testing, can be removed */}
                {/* <Button size="sm" onClick={() => setFactories(fs => fs.map(f => f.id === factory.id ? {...f, isLocked: false} : f))} className="mt-2">Dev Unlock</Button> */}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-1">
                    Producing:{' '}
                    {factory.selectedGoodId
                      ? goods.find((g) => g.id === factory.selectedGoodId)?.name
                      : 'Nothing'}
                  </p>
      
                  {/* <Progress value={factory.productionProgress} className="h-3 mb-2" /> */}
                  {factory.selectedGoodId && (
                    <div>
                      <p className="text-xs text-gray-500">
                        Required Resources:
                      </p>
                      {/* <ul className="list-disc list-inside text-xs text-gray-500">
                        {goods
                          .find((g) => g.id === factory.selectedGoodId)
                          ?.requiredResources.map((req) => {
                            const res = resources.find(
                              (r) => r.id === req.resourceId
                            );
                            const currentAmount = res ? res.amount : 0;
                            const neededAmount = req.amount * factory.level;
                            return (
                              <li
                                key={req.resourceId}
                                className={cn(
                                  currentAmount < neededAmount && 'text-red-400'
                                )}
                              >
                                {res?.name}: {neededAmount} (Have:{' '}
                                {Math.floor(currentAmount)})
                              </li>
                            );
                          })}
                      </ul> */}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-right">
                  <ShoppingCart
                    className={cn(
                      'w-10 h-10 mx-auto md:mx-0 md:ml-auto mb-1 transition-colors duration-300',

                         'text-green-400 animate-pulse'
                    )}
                  />
                  <p className="text-xs text-gray-500">Buyers Sim</p>
                  { ( // Show for 10s after sale
                      <p className="text-sm text-green-400 animate-ping absolute right-4 bottom-4">
                        +$
                        {(goods.find((g) => g.id === factory.selectedGoodId)
                          ?.basePrice || 0) * factory.level}
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
};

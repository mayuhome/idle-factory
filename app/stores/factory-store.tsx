import { Factory } from '@/types/factory';
import { FactoryIcon, FlaskConical, Leaf, Package, Settings2, Star } from 'lucide-react';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';

// type FactoryState = {
//   factories: Factory[];
// };

// type FactoryActions = {
//   setFactory: (factory: Factory) => void;
// };

// type FactoryStore = FactoryState & FactoryActions;

const initialFactories = {
    factories: [
    {
      id: 1,
      name: "Factory Alpha",
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
      name: "Factory Beta",
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
      name: "Factory Gamma",
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
      name: "Factory Delta",
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
      name: "Factory Epsilon",
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
      name: "Factory Zeta",
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
] as Factory[],
} ;

export const useFactoryStore = create<typeof initialFactories>()(
    devtools(
        subscribeWithSelector(
            persist(
                () => initialFactories,
                {
                    name: 'factory-store',
                    storage: createJSONStorage(() => localStorage),
                }
            )
        ),
        { name: 'factory-store', enabled: true }
    )
);
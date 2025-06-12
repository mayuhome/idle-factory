import { Goods } from '@/types/goods';
import { FactoryIcon, Gem, Users } from 'lucide-react';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

// type GoodsState = {
//   goods: Goods[];
// };

// type GoodsActions = {
//   setGoods: (goods: Goods[]) => void;
//   addGood: (good: Goods) => void;
//   removeGood: (goodId: string) => void;
// };

// type GoodsStore = GoodsState & GoodsActions;

const initialGoods = {
   goods: [
{
    id: "iron_ingot",
    name: "Iron Ingot",
    icon: <FactoryIcon className="w-5 h-5" />,
    basePrice: 10,
    requiredResources: [{ resourceId: 1, amount: 2 }],
  },
  {
    id: "crystal_lens",
    name: "Crystal Lens",
    icon: <Gem className="w-5 h-5" />,
    basePrice: 25,
    requiredResources: [
      { resourceId: 1, amount: 1 },
      { resourceId: 2, amount: 1 },
    ],
    researchId: "research_lens_crafting",
  },
  {
    id: "fabric",
    name: "Woven Fabric",
    icon: <Users className="w-5 h-5" />,
    basePrice: 15,
    requiredResources: [{ resourceId: 3, amount: 3 }],
  },
] as Goods[] };

export const useGoodsStore = create<typeof initialGoods>()(devtools(
    subscribeWithSelector(
        persist(() => initialGoods, {
            name: 'goods-store'
        }),
    ),
    { name: 'goods-store' }
));

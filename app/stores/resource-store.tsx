import { IBaseResource } from '@/models/resource';
import { Droplet, Flame, Gem, Leaf, Wheat, Zap } from 'lucide-react';
import { create, createStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { createSelectors } from '../utils/createSelectors';

// type ResourceState = {
//   resources: IBaseResource[];
// };

// type ResourceActions = {
//   resetResources: () => void;
//   addResource: (id: number, value: number) => void;
//   removeResource: (id: number, value: number) => void;
// };

// type ResourceStore = ResourceState & ResourceActions;

const initResource = {
  resources: [
    {
      id: 1,
      name: 'Jin',
      icon: <Gem className="w-4 h-4" />,
      color: 'text-purple-500',
      amount: 0,
      coolDown: 2.4,
    },
    {
      id: 2,
      name: 'Mana',
      icon: <Wheat className="w-4 h-4" />,
      color: 'text-yellow-500',
      amount: 0,
      coolDown: 2.4,
    },
    {
      id: 3,
      name: 'Raw Ore',
      icon: <Droplet className="w-4 h-4" />,
      color: 'text-blue-500',
      amount: 0,
      coolDown: 2.4,
    },
    {
      id: 4,
      name: 'Crystal Shard',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-yellow-400',
      amount: 0,
      coolDown: 2.4,
    },
    {
      id: 5,
      name: 'Plant Fiber',
      icon: <Flame className="w-4 h-4" />,
      color: 'text-red-500',
      amount: 0,
      coolDown: 2.4,
    },
    {
      id: 6,
      name: 'Mystic Essence',
      icon: <Leaf className="w-4 h-4" />,
      color: 'text-green-500',
      amount: 0,
      coolDown: 2.4,
    },
  ] as IBaseResource[],
};

export const useResourceStore = createSelectors(create<typeof initResource>()(
    // immer(
        devtools(
            subscribeWithSelector(
                persist(() => initResource, { name: 'resource-store' }),
            ),
            { name: 'resource-store', enabled: true },
        )
    // )
));

export const resetResources = () =>
    useResourceStore.setState(() => initResource);
export const addResource = (id: number, value: number) =>
    useResourceStore.setState((state: typeof initResource) => ({
        
        resources: state.resources.map((resource) => {
            if (resource.id === id) {
                return { ...resource, amount: resource.amount + value };
            }
            return resource;
        }),
  }));
export const removeResource = (id: number, value: number) =>
  useResourceStore.setState((state: typeof initResource) => ({
    resources: state.resources.map((resource) => {
      if (resource.id === id) {
        return { ...resource, amount: resource.amount - value };
      }
      return resource;
    }),
  }));

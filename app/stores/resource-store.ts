import { create } from 'zustand';
export const useResourceStore = create((set,get) => ({
    resource: {
        jin: 0,
        mu: 0,
        shui: 0,
        huo: 0,
        tu: 0
    },
    addResource: (key: string, value: number) => set((state: any) => ({ jin: state.resource[key] + value })),
    removeResource: (key: string, value: number) => set((state: any) => ({ resources: { ...state.resources, [key]: state.resources[key] - value } })),
}));
export interface ResourceQuality {
    level: 1 | 2 | 3 | 4 | 5;
    value: number;
}

export interface IResource {
    id: string;
    name: string;
    icon: React.ReactNode;
    amount: number;
    coolDown: number;
    quality: ResourceQuality;
    upgradeLevel: () => void;
}

export interface IBaseResource{
    id: number;
    name: string;
    icon: React.ReactNode;
    amount: number;
    color: string;
    coolDown: number;
}
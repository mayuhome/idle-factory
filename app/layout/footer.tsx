'use client'

import { Button } from '@/components/ui/button';
import { BookOpen, FactoryIcon, Pickaxe } from 'lucide-react';

export default function Footer({activeTab, setActiveTab}: {activeTab: string, setActiveTab: (tab: string) => void}) {
    const menuItems = [
    { id: "production", label: "Production", icon: <FactoryIcon className="w-4 h-4" /> },
    { id: "resource", label: "Resources", icon: <Pickaxe className="w-4 h-4" /> },
    { id: "research", label: "Research", icon: <BookOpen className="w-4 h-4" /> },
    // { id: "development", label: "Development", icon: <Hammer className="w-4 h-4" /> }, // Kept for potential future re-integration
    // { id: "equipment", label: "Equipment", icon: <Package className="w-4 h-4" /> },
    // { id: "employee", label: "Employee", icon: <Briefcase className="w-4 h-4" /> },
    // { id: "achievements", label: "Achievements", icon: <Trophy className="w-4 h-4" /> },
  ];

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  }
  return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10 z-40">
          <div className="max-w-7xl mx-auto p-3 sm:p-4">
            <nav className="flex items-center justify-center gap-1 sm:gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className={`flex-1 sm:flex-none items-center gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm ${activeTab === item.id ? "bg-gradient-to-r from-purple-600 to-pink-600" : "hover:bg-white/10"}`}
                >
                  {item.icon} <span className="hidden sm:inline">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </footer>
  )
}
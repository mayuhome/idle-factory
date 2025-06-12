'use client'

import { Button } from '@/components/ui/button';
import { BookOpen, FactoryIcon, Pickaxe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';


export default function Footer({ activeTab }: { activeTab: string }) {
  const router = useRouter()

  // 修正后的菜单项配置
  const menuItems = [
    {
      id: "production",
      path: "/production",
      label: "Production",
      icon: FactoryIcon // 直接引用组件
    },
    { 
      id: "resources", 
      path: "/resources",
      label: "Resources",
      icon: Pickaxe
    },
    { 
      id: "research", 
      path: "/research",
      label: "Research",
      icon: BookOpen
    },
  ]

  const navigateTo = (path: string) => {
    router.replace(path)
  }

  const onTabChange = (tab: string) => {



    // setActiveTab(tab);


  }
  return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10 z-40">
          <div className="max-w-7xl mx-auto p-3 sm:p-4">
            <nav className="flex items-center justify-center gap-1 sm:gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => navigateTo(item.id)}
                  className={`flex-1 sm:flex-none items-center gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm ${activeTab === item.id ? "bg-gradient-to-r from-purple-600 to-pink-600" : "hover:bg-white/10"}`}
                >
                  // 正确渲染方式
                  {React.createElement(item.icon, { className: "w-4 h-4" })}
                </Button>
              ))}
            </nav>
          </div>
        </footer>
  )
}
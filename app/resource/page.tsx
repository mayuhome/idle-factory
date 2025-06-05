import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Mine } from '@/types/mine'
import { RawResource } from '@/types/raw-resource'
import React from 'react'
import { useResourceStore } from '../stores/resource-store'



export const renderResourcePage = ({mines, rawResources}:{mines:Mine[], rawResources: RawResource[]}) => 
{
  const newResource = useResourceStore((state: any) => state.resource);
  const increaseResource = (key: string) => useResourceStore((state: any) => state.increaseResource(key, 10));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mines.map((mine) => {
        const resource = rawResources.find((r) => r.id === mine.producesResourceId)
        return (
          <Card key={mine.id} className={cn("overflow-hidden", mine.color)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-black/10" onClick={increaseResource(mine.name)}>
              <div className="flex items-center gap-2">
                {React.cloneElement(mine.icon, {
                  className: cn(mine.icon.props.className, resource?.color || "text-gray-300"),
                })}
                <CardTitle className="text-base">{mine.name}</CardTitle>
              </div>
              <span className="text-xs bg-black/20 px-2 py-1 rounded">Lvl {mine.level}</span>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm">
                Produces: <span className={cn(resource?.color)}>{resource?.name}</span>
              </p>
              <p className="text-sm">
                Produces amount: <span className={cn(resource?.color)}>{newResource[mine.name]}</span>
              </p>
              <p className="text-xs text-gray-400">Rate: {(mine.productionRate * mine.level).toFixed(2)}/sec</p>
              <Button size="sm" className="w-full mt-3 bg-slate-700 hover:bg-slate-600" disabled>
                Upgrade (Soon)
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
  
  
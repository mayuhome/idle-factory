import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'
import { useResourceStore, addResource, removeResource } from '../stores/resource-store'
import { Progress } from '@radix-ui/react-progress'



export const renderResourcesPage = () => 
{
  const resources = useResourceStore((state) => state.resources);
  console.log(resources);
  


  const increase = (id: number) => {
    console.log(`increase ${id}`);
    
    return addResource(id, 10);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => {
        return (
          <Card key={resource.id} className={cn("overflow-hidden", resource.color)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-black/10" onClick={() => increase(resource.id)}>
              <div className="flex items-center gap-2">
                {/* {React.cloneElement(resource.icon, {
                  className: cn(resource.icon.props.className, resource.color || "text-gray-300"),
                })} */}
                <CardTitle className="text-base">{resource.name}</CardTitle>
              </div>
              {/* <span className="text-xs bg-black/20 px-2 py-1 rounded">Lvl {resource.level}</span> */}
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm">
                Produces: <span className={cn(resource?.color)}>{resource?.name}</span>
              </p>
              <p className="text-sm">
                Produces amount: <span className={cn(resource?.color)}>{resource.amount}</span>
              </p>
              <p className="text-xs text-gray-400">Cool Down: {(resource.coolDown).toFixed(2)}/sec</p>
              <Progress value={resource.coolDown} max={100} />
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
  
  
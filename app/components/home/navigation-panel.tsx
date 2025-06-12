import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Package,
  Leaf,
  FlaskConical
} from 'lucide-react'

export const NavigationPanel = () => (
  <div className="grid grid-cols-3 gap-4 mb-8">
    <Button variant="outline" className="h-20" asChild>
      <Link href="/production">
        <div className="text-center">
          <Package className="w-8 h-8 mb-2 mx-auto" />
          Production
        </div>
      </Link>
    </Button>
    <Button variant="outline" className="h-20" asChild>
      <Link href="/resources">
        <div className="text-center">
          <Leaf className="w-8 h-8 mb-2 mx-auto" />
          Resources
        </div>
      </Link>
    </Button>
    <Button variant="outline" className="h-20" asChild>
      <Link href="/research">
        <div className="text-center">
          <FlaskConical className="w-8 h-8 mb-2 mx-auto" />
          Research
        </div>
      </Link>
    </Button>
  </div>
)
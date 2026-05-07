'use client'

import { AlertTriangle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'

interface StalenessWarningProps {
  lastVerifiedAt: string
}

export function StalenessWarning({ lastVerifiedAt }: StalenessWarningProps) {
  const daysSince = Math.floor(
    (Date.now() - new Date(lastVerifiedAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysSince <= 90) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center text-amber-500 cursor-help">
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Not verified in {daysSince} days — confirm with regulator source
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

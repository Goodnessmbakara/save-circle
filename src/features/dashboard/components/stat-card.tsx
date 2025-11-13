import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  description?: string
  trend?: string
  icon?: ReactNode
  className?: string
  footer?: ReactNode
}

export const StatCard = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
  footer,
}: StatCardProps) => (
  <Card className={cn(className)}>
    <CardHeader className="flex flex-row items-start justify-between">
      <div>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <p className="mt-2 text-2xl font-semibold">{value}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {icon}
    </CardHeader>
    {(trend || footer) && (
      <CardContent className="text-sm text-muted-foreground">
        {trend}
        {footer}
      </CardContent>
    )}
  </Card>
)


"use client"

import { QRCodeSVG } from "qrcode.react"
import { cn } from "@/lib/utils"

interface QRCodeProps {
  value: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
  className?: string
}

export const QRCode = ({ value, size = 256, level = "M", className }: QRCodeProps) => {
  if (!value) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border bg-muted/40 text-sm text-muted-foreground",
          className,
        )}
        style={{ width: size, height: size }}
      >
        No invoice available
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center rounded-xl border bg-white p-4", className)}>
      <QRCodeSVG value={value} size={size} level={level} />
    </div>
  )
}


"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      <Link href="/" className="flex items-center text-primary/60 hover:text-primary transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`
        const isLast = index === segments.length - 1
        const title = segment.charAt(0).toUpperCase() + segment.slice(1)

        return (
          <div key={segment} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-primary/40" />
            {isLast ? (
              <span className="ml-2 font-medium text-primary">{title}</span>
            ) : (
              <Link href={href} className="ml-2 text-primary/60 hover:text-primary transition-colors">
                {title}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}


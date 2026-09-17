"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, LayoutDashboard, Menu, X } from "lucide-react"
import { tools } from "@/lib/tools"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", name: "Dashboard", icon: LayoutDashboard },
  ...tools.map((t) => ({ href: t.href, name: t.name, icon: t.icon })),
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-1">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-semibold tracking-tight">FlowDesk</span>
        <span className="text-[11px] text-muted-foreground">AI Productivity</span>
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-svh bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-sidebar px-4 py-5 md:flex">
        <Brand />
        <div className="mt-7 flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
          Outputs are AI-generated drafts. Review for accuracy before use.
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
        <Brand />
        <Button
          variant="outline"
          size="icon"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-4" />
        </Button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-sidebar px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Brand />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="mt-7 flex-1 overflow-y-auto">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <main className="flex-1 px-4 pb-16 pt-20 md:px-8 md:pt-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

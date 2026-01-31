"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sidebar } from "./sidebar"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="h-full [&_aside]:w-full [&_aside]:border-r-0 [&_aside>button:last-child]:hidden">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

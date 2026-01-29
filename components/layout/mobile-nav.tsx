"use client"
import { Sidebar } from "./sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Menu Lateral</DialogTitle>
            <DialogDescription>Navegação principal para dispositivos móveis</DialogDescription>
          </DialogHeader>
          <Sidebar />
        </DialogContent>
      </Dialog>
    </>
  )
}


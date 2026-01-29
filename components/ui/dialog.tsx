"use client"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import React from "react"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[95vw] max-w-lg rounded-lg bg-white shadow-sm",
          className
        )}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ title, description, children }: { title?: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 p-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {children}
    </div>
  )
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <DialogPrimitive.Title className={cn("text-lg font-semibold", className)}>
      {children}
    </DialogPrimitive.Title>
  )
}

export function DialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <DialogPrimitive.Description className={cn("text-sm text-gray-600", className)}>
      {children}
    </DialogPrimitive.Description>
  )
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-2 p-4">{children}</div>
}

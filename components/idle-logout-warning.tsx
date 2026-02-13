"use client"
import { useTranslations } from "next-intl"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface IdleLogoutWarningProps {
  open: boolean
  remainingSeconds: number
  onStayLoggedIn: () => void
}

export function IdleLogoutWarning({ open, remainingSeconds, onStayLoggedIn }: IdleLogoutWarningProps) {
  const t = useTranslations("auth")

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const timeDisplay = minutes > 0
    ? `${minutes}:${seconds.toString().padStart(2, "0")}`
    : `${seconds}s`

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("idleWarningTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("idleWarningDescription", { time: timeDisplay })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onStayLoggedIn}>
            {t("stayLoggedIn")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

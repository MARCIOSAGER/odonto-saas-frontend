"use client"

import { useLocale } from "next-intl"
import PrivacyPagePt from "./privacy-pt"
import PrivacyPageEn from "./privacy-en"

export default function PrivacyPage() {
  const locale = useLocale()
  return locale === "en" ? <PrivacyPageEn /> : <PrivacyPagePt />
}

"use client"

import { useLocale } from "next-intl"
import TermsPagePt from "./terms-pt"
import TermsPageEn from "./terms-en"

export default function TermsPage() {
  const locale = useLocale()
  return locale === "en" ? <TermsPageEn /> : <TermsPagePt />
}

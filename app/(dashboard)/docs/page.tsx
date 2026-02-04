"use client"
import { useLocale } from "next-intl"
import DocsPagePt from "./docs-pt"
import DocsPageEn from "./docs-en"

export default function DocsPage() {
  const locale = useLocale()
  return locale === "en" ? <DocsPageEn /> : <DocsPagePt />
}

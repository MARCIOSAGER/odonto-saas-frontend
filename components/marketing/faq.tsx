"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium pr-4">{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  )
}

export function Faq() {
  const t = useTranslations("faq")

  const faqs = [
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: t("a2") },
    { question: t("q3"), answer: t("a3") },
    { question: t("q4"), answer: t("a4") },
    { question: t("q5"), answer: t("a5") },
    { question: t("q6"), answer: t("a6") },
    { question: t("q7"), answer: t("a7") },
    { question: t("q8"), answer: t("a8") },
  ]

  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/30">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  )
}

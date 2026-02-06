"use client"
import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

function FaqItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className={cn(
          "font-medium pr-4 transition-colors",
          isOpen ? "text-violet-600" : "text-gray-900 group-hover:text-violet-600"
        )}>
          {question}
        </span>
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all",
          isOpen ? "bg-violet-100" : "bg-gray-100 group-hover:bg-violet-50"
        )}>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-all",
              isOpen ? "rotate-180 text-violet-600" : "text-gray-400 group-hover:text-violet-500"
            )}
          />
        </div>
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isOpen ? "max-h-96 pb-5" : "max-h-0"
      )}>
        <p className="text-gray-600 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  )
}

export function Faq() {
  const t = useTranslations("faq")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

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
    <section id="faq" className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-6">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Contact prompt */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Nao encontrou sua pergunta?{" "}
            <a href="/contato" className="text-violet-600 font-medium hover:text-violet-700 underline underline-offset-2">
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

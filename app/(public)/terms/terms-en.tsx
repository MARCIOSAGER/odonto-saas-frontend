"use client"

import Link from "next/link"

export default function TermsPageEn() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="text-lg font-bold text-sky-700">INTER-IA</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        <h1>Terms of Use</h1>
        <p className="text-sm text-gray-500">Last updated: February 1, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using the INTER-IA platform, you agree to these Terms of Use.
          If you do not agree with any part, please do not use our services.
        </p>

        <h2>2. Service Description</h2>
        <p>
          INTER-IA is a management platform for dental clinics that offers scheduling,
          patient management, electronic health records, WhatsApp communication, and other
          clinic management tools.
        </p>

        <h2>3. Registration and Account</h2>
        <p>
          To use the service, you must create an account by providing truthful and complete
          information. You are responsible for maintaining the confidentiality of your
          login credentials.
        </p>

        <h2>4. Plans and Payment</h2>
        <p>
          The platform offers different plans with varying features. The free trial period
          is 14 days. After the trial period, you must subscribe to a plan to continue
          using the service.
        </p>

        <h2>5. Data Protection</h2>
        <p>
          All data stored on the platform is protected with encryption and follows the best
          information security practices. The data belongs to the account holder and can be
          exported at any time.
        </p>

        <h2>6. User Responsibilities</h2>
        <ul>
          <li>Keep your registration data up to date</li>
          <li>Do not share login credentials</li>
          <li>Use the service in accordance with applicable laws</li>
          <li>Ensure the accuracy of the information entered</li>
          <li>Respect the privacy of registered patients</li>
        </ul>

        <h2>7. LGPD and Privacy</h2>
        <p>
          INTER-IA complies with the Brazilian General Data Protection Law (LGPD).
          For more details on how we handle your data, please refer to our{" "}
          <Link href="/privacy" className="text-sky-600 hover:underline">Privacy Policy</Link>.
        </p>

        <h2>8. Cancellation</h2>
        <p>
          You may cancel your subscription at any time. After cancellation, access will
          be maintained until the end of the already paid period. Your data will be kept
          for 90 days after cancellation and can be exported during that period.
        </p>

        <h2>9. Data Deletion</h2>
        <p>
          In compliance with the LGPD, you may request the complete deletion of your data
          at any time through the account settings or by contacting our support team.
        </p>

        <h2>10. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Significant changes will
          be communicated by email with a minimum notice of 30 days.
        </p>

        <h2>11. Contact</h2>
        <p>
          For questions about these terms, please contact us at: contato@marciosager.com
        </p>
      </main>
    </div>
  )
}

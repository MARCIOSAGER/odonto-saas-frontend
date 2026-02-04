"use client"

import Link from "next/link"

export default function PrivacyPageEn() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="text-lg font-bold text-sky-700">Odonto SaaS</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: February 1, 2026</p>

        <h2>1. Introduction</h2>
        <p>
          Odonto SaaS respects the privacy of its users and is committed to protecting
          personal data. This policy describes how we collect, use, and protect your
          information, in compliance with the Brazilian General Data Protection Law
          (LGPD - Law No. 13,709/2018).
        </p>

        <h2>2. Data Collected</h2>
        <h3>2.1 User Data (Professional)</h3>
        <ul>
          <li>Name, email, phone number</li>
          <li>CNPJ and clinic information</li>
          <li>Login credentials</li>
          <li>Platform usage data</li>
        </ul>

        <h3>2.2 Patient Data</h3>
        <ul>
          <li>Name, phone number, CPF, email</li>
          <li>Date of birth, address</li>
          <li>Appointment and treatment history</li>
          <li>Medical records and clinical notes</li>
          <li>Anamnesis and odontogram data</li>
        </ul>

        <h2>3. Purpose of Data Processing</h2>
        <p>Data is collected for:</p>
        <ul>
          <li>Providing clinic management services</li>
          <li>Scheduling and patient communication</li>
          <li>Issuing prescriptions and clinical documents</li>
          <li>Sending reminders and notifications</li>
          <li>Generating financial and operational reports</li>
          <li>Continuous platform improvement</li>
        </ul>

        <h2>4. Legal Basis</h2>
        <p>
          Data processing is carried out based on user consent, contract execution,
          compliance with legal obligations, and legitimate interest.
        </p>

        <h2>5. Data Sharing</h2>
        <p>
          We do not sell, rent, or share personal data with third parties, except
          when necessary for:
        </p>
        <ul>
          <li>Payment processing (payment gateways)</li>
          <li>Message delivery (WhatsApp API)</li>
          <li>Invoice issuance</li>
          <li>Compliance with legal obligations</li>
        </ul>

        <h2>6. Data Security</h2>
        <p>We adopt security measures that include:</p>
        <ul>
          <li>Data encryption in transit (HTTPS/TLS)</li>
          <li>Password encryption (bcrypt)</li>
          <li>Two-factor authentication (2FA)</li>
          <li>Role-based access control (RBAC)</li>
          <li>Audit logs</li>
          <li>Regular backups</li>
        </ul>

        <h2>7. Data Subject Rights</h2>
        <p>In compliance with the LGPD, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct incomplete or outdated data</li>
          <li>Data portability</li>
          <li>Deletion of personal data</li>
          <li>Revocation of consent</li>
          <li>Information about data sharing</li>
        </ul>

        <h2>8. Data Retention</h2>
        <p>
          Data is retained while the account is active. After cancellation, data is
          kept for 90 days for possible reactivation and is permanently deleted after
          that period, except when there is a legal obligation to retain it.
        </p>

        <h2>9. Cookies</h2>
        <p>
          We use essential cookies for the platform to function and session cookies to
          maintain login. We do not use third-party tracking cookies.
        </p>

        <h2>10. Data Protection Officer (DPO) Contact</h2>
        <p>
          To exercise your rights or clarify questions about data processing,
          please contact: privacidade@odontosaas.com.br
        </p>
      </main>
    </div>
  )
}

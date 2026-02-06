"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen, Home, Users, Calendar, MessageSquare, Stethoscope,
  Briefcase, Settings, Smartphone, Bot, Bell, MousePointer,
  ChevronRight, Search, Shield, MapPin, BarChart3, Star,
  CreditCard, Mail, Lock, FileText, ClipboardList, UserCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function DocsPageEn() {
  const [activeSection, setActiveSection] = useState("getting-started")

  const sections: Section[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Home size={18} />,
      content: <GettingStarted />,
    },
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <BarChart3 size={18} />,
      content: <DashboardSection />,
    },
    {
      id: "patients",
      title: "Patients",
      icon: <Users size={18} />,
      content: <PatientsSection />,
    },
    {
      id: "appointments",
      title: "Appointments",
      icon: <Calendar size={18} />,
      content: <AppointmentsSection />,
    },
    {
      id: "conversations",
      title: "WhatsApp Conversations",
      icon: <MessageSquare size={18} />,
      content: <ConversationsSection />,
    },
    {
      id: "dentists",
      title: "Dentists",
      icon: <Stethoscope size={18} />,
      content: <DentistsSection />,
    },
    {
      id: "services",
      title: "Services",
      icon: <Briefcase size={18} />,
      content: <ServicesSection />,
    },
    {
      id: "odontogram",
      title: "Odontogram",
      icon: <ClipboardList size={18} />,
      content: <OdontogramSection />,
    },
    {
      id: "prescriptions",
      title: "Digital Prescriptions",
      icon: <FileText size={18} />,
      content: <PrescriptionsSection />,
    },
    {
      id: "reports",
      title: "Reports",
      icon: <BarChart3 size={18} />,
      content: <ReportsSection />,
    },
    {
      id: "nps",
      title: "NPS & Satisfaction",
      icon: <Star size={18} />,
      content: <NpsSection />,
    },
    {
      id: "clinic-settings",
      title: "Clinic Settings",
      icon: <Settings size={18} />,
      content: <ClinicSettingsSection />,
    },
    {
      id: "whatsapp",
      title: "WhatsApp (Z-API)",
      icon: <Smartphone size={18} />,
      content: <WhatsAppSection />,
    },
    {
      id: "automations",
      title: "WhatsApp Automations",
      icon: <Bell size={18} />,
      content: <AutomationsSection />,
    },
    {
      id: "email",
      title: "Email Configuration",
      icon: <Mail size={18} />,
      content: <EmailSection />,
    },
    {
      id: "ai",
      title: "AI Assistant",
      icon: <Bot size={18} />,
      content: <AISection />,
    },
    {
      id: "interactive",
      title: "Interactive Messages",
      icon: <MousePointer size={18} />,
      content: <InteractiveSection />,
    },
    {
      id: "reminders",
      title: "Automatic Reminders",
      icon: <Bell size={18} />,
      content: <RemindersSection />,
    },
    {
      id: "dentist-whatsapp",
      title: "Dentist via WhatsApp",
      icon: <Stethoscope size={18} />,
      content: <DentistWhatsAppSection />,
    },
    {
      id: "billing",
      title: "Billing & Plans",
      icon: <CreditCard size={18} />,
      content: <BillingSection />,
    },
    {
      id: "security",
      title: "Security & 2FA",
      icon: <Lock size={18} />,
      content: <SecuritySection />,
    },
    {
      id: "patient-portal",
      title: "Patient Portal",
      icon: <UserCircle size={18} />,
      content: <PatientPortalSection />,
    },
    {
      id: "command-palette",
      title: "Quick Search (Cmd+K)",
      icon: <Search size={18} />,
      content: <CommandPaletteSection />,
    },
  ]

  return (
    <div className="max-w-6xl pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" />
          User Guide
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Learn how to use all the features of the INTER-IA platform.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Navigation sidebar */}
        <nav className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-muted/50 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                {section.icon}
                {section.title}
                {activeSection === section.id && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile selector */}
        <div className="lg:hidden w-full mb-4">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full p-2 rounded-lg border border-border bg-background text-sm"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {sections.find((s) => s.id === activeSection)?.content}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function DocCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border bg-card shadow-sm mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        {children}
      </CardContent>
    </Card>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800 my-3">
      <Shield size={14} className="shrink-0 mt-0.5 text-blue-500" />
      <div>{children}</div>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
        {number}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">{title}</p>
        <div className="text-sm text-gray-600 dark:text-gray-400">{children}</div>
      </div>
    </div>
  )
}

// ==========================================
// SECTIONS
// ==========================================

function GettingStarted() {
  return (
    <>
      <DocCard title="Welcome to INTER-IA">
        <p className="text-sm mb-4">
          INTER-IA is a complete platform for dental clinic management, featuring intelligent WhatsApp customer service, online scheduling, digital odontogram, prescriptions, NPS, financial reports, and much more.
        </p>
        <p className="text-sm font-semibold mb-3">To get started, follow these steps:</p>
        <Step number={1} title="Set up your clinic">
          <p>Go to <strong>Settings &gt; My Clinic</strong> and fill in your details: name, phone number, address, tax ID, business hours, logo, colors, and social media.</p>
        </Step>
        <Step number={2} title="Register your dentists">
          <p>In the <strong>Dentists</strong> menu, add your clinic&apos;s professionals with name, specialty, license number, phone number, and commission rate.</p>
        </Step>
        <Step number={3} title="Register your services">
          <p>In <strong>Services</strong>, register the procedures offered with name, price, duration, and category.</p>
        </Step>
        <Step number={4} title="Set up WhatsApp">
          <p>Go to <strong>Settings &gt; WhatsApp</strong>, add your Z-API credentials (Instance ID, Token, Client-Token), and connect by scanning the QR Code.</p>
        </Step>
        <Step number={5} title="Set up AI">
          <p>In <strong>Settings &gt; AI Assistant</strong>, choose the provider (Claude, GPT, or Gemini), enter the API Key, and customize the assistant.</p>
        </Step>
        <Step number={6} title="Set up Email (optional)">
          <p>In <strong>Settings &gt; Email</strong>, add your SMTP credentials for sending prescriptions, certificates, and email notifications.</p>
        </Step>
        <Step number={7} title="All set!">
          <p>Your clinic is configured. Patients can send messages via WhatsApp and the AI will automatically respond, schedule appointments, provide pricing information, and much more.</p>
        </Step>
        <Tip>
          <p>Use the shortcut <strong>Cmd+K</strong> (or Ctrl+K) at any time to quickly navigate between pages and search for patients.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function DashboardSection() {
  return (
    <>
      <DocCard title="Dashboard">
        <p className="text-sm mb-3">
          The Dashboard is the system&apos;s home screen. Here you get an overview of your clinic with real-time metrics:
        </p>
        <ul className="text-sm space-y-2 list-disc list-inside">
          <li><strong>Total Patients</strong> — Number of patients registered at the clinic.</li>
          <li><strong>Confirmed Today</strong> — Appointments confirmed for the current day.</li>
          <li><strong>Pending Appointments</strong> — Appointments with &quot;scheduled&quot; status that have not yet been confirmed.</li>
          <li><strong>Monthly Revenue</strong> — Sum of service values from completed appointments in the month.</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Weekly Flow Chart</h4>
        <p className="text-sm mb-2">
          The chart shows the number of appointments per day of the current week, allowing you to visualize patient flow.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Upcoming Appointments</h4>
        <p className="text-sm mb-2">
          Lists the next 5 appointments of the day with patient name, service, time, and status.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Subscription Alerts</h4>
        <p className="text-sm">
          If the trial period is close to expiring (7 days or less) or has already expired, an alert banner will be displayed with a link to subscribe to a plan.
        </p>
        <Tip>
          <p>Dashboard data is updated automatically. Click <strong>View full schedule</strong> to go directly to the appointments page.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function PatientsSection() {
  return (
    <>
      <DocCard title="Patient Management">
        <p className="text-sm mb-3">
          The Patients module allows you to register, edit, and view all patients at the clinic.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Register a Patient</h4>
        <p className="text-sm mb-2">
          Click <strong>&quot;New Patient&quot;</strong> and fill in: full name, tax ID (CPF), phone number (with area code), email, and date of birth.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Patient Record</h4>
        <p className="text-sm mb-2">
          By clicking on a patient&apos;s name, you access their complete record with:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Personal and contact information</li>
          <li>Appointment history (scheduled, completed, canceled)</li>
          <li>WhatsApp conversation history</li>
          <li>Digital odontogram</li>
          <li>Issued prescriptions and certificates</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Search & Filters</h4>
        <p className="text-sm mb-2">
          Use the search bar to find patients by name, phone number, or tax ID. The list is paginated for better performance.
        </p>
        <Tip>
          <p><strong>Automatic registration:</strong> When a new patient sends a message via WhatsApp, the AI automatically creates their record using their name and phone number. You can complete the details later.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function AppointmentsSection() {
  return (
    <>
      <DocCard title="Appointments">
        <p className="text-sm mb-3">
          Manage all clinic appointments with a calendar view (day, week, or month). You can create appointments manually or let the AI schedule them automatically via WhatsApp.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Create a Manual Appointment</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Click <strong>&quot;New Appointment&quot;</strong></li>
          <li>Select the patient, dentist, service, date, and time</li>
          <li>Add notes if necessary</li>
          <li>Click <strong>Save</strong></li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Appointment Status</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Scheduled</strong> — Appointment created, awaiting confirmation</li>
          <li><strong>Confirmed</strong> — Patient confirmed attendance</li>
          <li><strong>Completed</strong> — Appointment successfully carried out</li>
          <li><strong>Canceled</strong> — Appointment canceled by the patient or clinic</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">AI Scheduling</h4>
        <p className="text-sm">
          If the <strong>&quot;Schedule Appointments&quot;</strong> permission is enabled in the AI settings, the virtual assistant can create appointments directly via WhatsApp, automatically checking available time slots.
        </p>
        <Tip>
          <p>The AI can also <strong>confirm</strong> and <strong>cancel</strong> appointments if the permissions are enabled. The dentist receives a WhatsApp notification when an appointment is created or confirmed.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function ConversationsSection() {
  return (
    <>
      <DocCard title="WhatsApp Conversations">
        <p className="text-sm mb-3">
          View all conversations between patients and the AI assistant in real time.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">How it works</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Each conversation is linked to a patient and clinic</li>
          <li>Patient and AI messages are displayed in chat format</li>
          <li>You can view the complete history of each conversation</li>
          <li>Tool use messages (scheduling, confirmation, etc.) are logged</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Conversation Flow</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Patient sends a message via WhatsApp</li>
          <li>The Z-API webhook receives the message</li>
          <li>The AI processes it and generates a response with clinic context</li>
          <li>The response is sent back via WhatsApp</li>
          <li>The entire conversation is recorded in the system</li>
        </ol>
        <Tip>
          <p>If the AI cannot resolve the issue, the patient can use transfer keywords (configured in <strong>Settings &gt; AI &gt; Advanced Instructions</strong>) to be forwarded to a human agent.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function DentistsSection() {
  return (
    <>
      <DocCard title="Dentist Management">
        <p className="text-sm mb-3">
          Register and manage your clinic&apos;s professionals.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Registration Fields</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Name</strong> — Full name of the professional</li>
          <li><strong>Specialty</strong> — E.g.: Orthodontics, Endodontics, General Dentistry</li>
          <li><strong>License Number (CRO)</strong> — Registration with the Regional Dental Council</li>
          <li><strong>Phone</strong> — WhatsApp number (important for notifications)</li>
          <li><strong>Email</strong> — Professional email</li>
          <li><strong>Commission (%)</strong> — Commission percentage on services performed</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Office Hours</h4>
        <p className="text-sm mb-2">
          Configure each dentist&apos;s office hours by day of the week. The AI uses this information to suggest available time slots to the patient.
        </p>
        <Tip>
          <p><strong>Important:</strong> The dentist&apos;s phone number is used to identify them when they send messages via WhatsApp (&quot;Dentist via WhatsApp&quot; feature). Make sure to register the correct number with area code.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function ServicesSection() {
  return (
    <>
      <DocCard title="Services & Procedures">
        <p className="text-sm mb-3">
          Register all services offered by the clinic. The AI uses this information to provide pricing and schedule appointments.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Service Fields</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Name</strong> — E.g.: Cleaning, Whitening, Root Canal, Implant</li>
          <li><strong>Description</strong> — Procedure details</li>
          <li><strong>Price</strong> — Value in currency (displayed by the AI when the patient asks)</li>
          <li><strong>Duration</strong> — Estimated time in minutes (used to calculate availability)</li>
          <li><strong>Category</strong> — E.g.: Aesthetic, Preventive, Restorative</li>
        </ul>
        <Tip>
          <p>The AI automatically has access to all registered services and prices. When a patient asks &quot;how much does a cleaning cost?&quot;, the AI responds with the correct amount.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function OdontogramSection() {
  return (
    <>
      <DocCard title="Digital Odontogram">
        <p className="text-sm mb-3">
          The odontogram is a visual representation of the patient&apos;s dental arch. It allows you to record conditions and procedures per tooth and per dental surface.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">How to access</h4>
        <p className="text-sm mb-2">
          Go to a patient&apos;s record and click the <strong>Odontogram</strong> tab. The dental chart will be displayed with all 32 teeth.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Record conditions</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Click on a tooth to select it</li>
          <li>Choose the dental surface (buccal, lingual, mesial, distal, occlusal)</li>
          <li>Select the condition: cavity, restoration, missing, implant, prosthesis, etc.</li>
          <li>Add notes if necessary</li>
          <li>Save to record in the history</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Visual Legend</h4>
        <p className="text-sm">
          Each condition is represented by a different color on the dental chart, making it easy to quickly visualize the state of the patient&apos;s dental arch.
        </p>
        <Tip>
          <p>The odontogram maintains a complete history. You can track the treatment evolution over time.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function PrescriptionsSection() {
  return (
    <>
      <DocCard title="Digital Prescriptions">
        <p className="text-sm mb-3">
          Create digital prescriptions, certificates, and referrals with your clinic&apos;s visual identity. Send them directly to the patient via WhatsApp or email.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Document Types</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Prescription</strong> — Medication prescription</li>
          <li><strong>Certificate</strong> — Attendance or leave certificate</li>
          <li><strong>Referral</strong> — Referral to a specialist</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">How to create</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Go to the patient&apos;s record</li>
          <li>Click <strong>New Prescription</strong> (or Certificate/Referral)</li>
          <li>Fill in the document content</li>
          <li>Select the responsible dentist</li>
          <li>Save and send via WhatsApp or email</li>
        </ol>
        <Tip>
          <p>The document is generated as a PDF with the clinic&apos;s logo and details automatically. Configure branding in <strong>Settings &gt; My Clinic</strong>.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function ReportsSection() {
  return (
    <>
      <DocCard title="Reports">
        <p className="text-sm mb-3">
          The reports module provides a detailed view of the clinic&apos;s financial and operational performance.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Available Reports</h4>
        <ul className="text-sm space-y-2 list-disc list-inside mb-3">
          <li><strong>Revenue by Dentist</strong> — How much each professional billed in the selected period.</li>
          <li><strong>Cash Flow</strong> — Financial inflows and outflows with day/week/month view.</li>
          <li><strong>Commissions</strong> — Automatic commission calculation per dentist based on services performed.</li>
          <li><strong>Appointments</strong> — Number of appointments by status, dentist, and period.</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Filters</h4>
        <p className="text-sm mb-2">
          All reports allow filtering by period (start and end date) and by dentist.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Export</h4>
        <p className="text-sm">
          Export data to CSV for analysis in spreadsheets such as Excel or Google Sheets.
        </p>
        <Tip>
          <p>Access reports from the sidebar menu under <strong>Reports</strong>. Data is calculated in real time based on completed appointments.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function NpsSection() {
  return (
    <>
      <DocCard title="NPS & Satisfaction Survey">
        <p className="text-sm mb-3">
          The NPS (Net Promoter Score) module allows you to send automatic satisfaction surveys after appointments.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">How it works</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>After an appointment is marked as <strong>completed</strong>, the system can automatically send an NPS survey to the patient</li>
          <li>The patient receives a link via WhatsApp to rate from 0 to 10</li>
          <li>The patient can add an optional comment</li>
          <li>The rating is saved and displayed on the NPS dashboard</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">NPS Classification</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Promoters (9-10)</strong> — Satisfied patients, potential advocates</li>
          <li><strong>Passives (7-8)</strong> — Satisfied but not enthusiastic</li>
          <li><strong>Detractors (0-6)</strong> — Dissatisfied patients</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Configuration</h4>
        <p className="text-sm mb-2">
          Go to <strong>Settings &gt; NPS</strong> to enable/disable surveys and customize the message sent to the patient.
        </p>
        <Tip>
          <p><strong>Google Reviews:</strong> Promoters (score 9-10) can be automatically redirected to leave a review on the clinic&apos;s Google Reviews. Configure the link in the NPS settings.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function ClinicSettingsSection() {
  return (
    <>
      <DocCard title="Clinic Settings">
        <p className="text-sm mb-3">
          In <strong>Settings &gt; My Clinic</strong>, you configure all your clinic&apos;s data:
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Basic Information</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Name, Tax ID, Phone, Email</strong> — Identification information</li>
          <li><strong>Full Address</strong> — Street, city, state, zip code</li>
          <li><strong>Latitude/Longitude</strong> — For sending location via WhatsApp</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Branding</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Logo</strong> — Upload your clinic&apos;s logo (displayed in the sidebar and documents)</li>
          <li><strong>Favicon</strong> — Browser tab icon</li>
          <li><strong>Primary Color</strong> — Main interface color (hex format, e.g.: #0EA5E9)</li>
          <li><strong>Secondary Color</strong> — Accent color</li>
          <li><strong>Display Mode</strong> — Logo + name, logo only, or name only in the sidebar</li>
          <li><strong>Slogan and Tagline</strong> — Clinic slogans</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Social Media</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Instagram, Facebook, Website</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Business Hours</h4>
        <p className="text-sm">
          Configure the hours for each day of the week. The AI uses this information to know when the clinic is open and sends an &quot;outside business hours&quot; message when configured.
        </p>
        <Tip>
          <p>The colors configured here are applied in real time across the entire interface. Each clinic has its own custom branding.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function WhatsAppSection() {
  return (
    <>
      <DocCard title="WhatsApp Setup (Z-API)">
        <p className="text-sm mb-3">
          WhatsApp integration is done through Z-API. You need a Z-API account to connect.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Step by Step</h4>
        <Step number={1} title="Create a Z-API account">
          <p>Go to <strong>z-api.io</strong> and create your account. You will receive an Instance ID and a Token.</p>
        </Step>
        <Step number={2} title="Get your credentials">
          <p>In the Z-API dashboard, copy:</p>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li><strong>Instance ID</strong> — Instance identifier</li>
            <li><strong>Token</strong> — Authentication token</li>
            <li><strong>Client-Token</strong> — Security token (in security settings)</li>
          </ul>
        </Step>
        <Step number={3} title="Configure in the system">
          <p>Go to <strong>Settings &gt; WhatsApp</strong> and paste the three credentials in the corresponding fields. Save.</p>
        </Step>
        <Step number={4} title="Connect WhatsApp">
          <p>Click <strong>&quot;Test Connection&quot;</strong>. If it shows &quot;disconnected&quot;, click <strong>&quot;Generate QR Code&quot;</strong> and scan it with your WhatsApp.</p>
        </Step>
        <Step number={5} title="Configure the Webhook">
          <p>Click <strong>&quot;Configure Webhook Automatically&quot;</strong>. This makes Z-API send received messages to your system.</p>
        </Step>
        <Tip>
          <p><strong>Tip:</strong> If the connection drops, use the <strong>&quot;Restart Instance&quot;</strong> button before generating a new QR Code. Usually, reconnection is automatic.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function AutomationsSection() {
  return (
    <>
      <DocCard title="WhatsApp Automations">
        <p className="text-sm mb-3">
          Configure automations and message templates to streamline communication with patients via WhatsApp.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Message Templates</h4>
        <p className="text-sm mb-2">
          Create pre-formatted messages for common situations:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Appointment confirmation</strong> — Sent when an appointment is scheduled</li>
          <li><strong>Reminder</strong> — Sent 24h or 1h before the appointment</li>
          <li><strong>Post-appointment</strong> — Thank you and satisfaction survey</li>
          <li><strong>Birthday</strong> — Personalized message on the patient&apos;s birthday</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Available Variables</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><code className="bg-muted px-1 rounded text-xs">{"{patientName}"}</code> — Patient name</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{date}"}</code> — Appointment date</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{time}"}</code> — Appointment time</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{service}"}</code> — Service name</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{dentist}"}</code> — Dentist name</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{clinicName}"}</code> — Clinic name</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">How to access</h4>
        <p className="text-sm">
          Go to <strong>Settings &gt; Automations</strong> to create and manage message templates.
        </p>
        <Tip>
          <p>Automations work together with automatic reminders. Configure both for a complete communication flow.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function EmailSection() {
  return (
    <>
      <DocCard title="Email Configuration (SMTP)">
        <p className="text-sm mb-3">
          Configure your clinic&apos;s email sending for notifications, prescriptions, certificates, and password resets.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Configuration Fields</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>SMTP Host</strong> — E.g.: smtp.hostinger.com, smtp.gmail.com</li>
          <li><strong>Port</strong> — Usually 465 (SSL) or 587 (TLS)</li>
          <li><strong>Secure (SSL)</strong> — Enable for SSL ports (465)</li>
          <li><strong>Username</strong> — Your email (e.g.: contact@yourclinic.com)</li>
          <li><strong>Password</strong> — Email password or app password</li>
          <li><strong>Sender (From)</strong> — Name and email that appears to the patient</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">How to configure</h4>
        <Step number={1} title="Access settings">
          <p>Go to <strong>Settings &gt; Email</strong>.</p>
        </Step>
        <Step number={2} title="Fill in the SMTP details">
          <p>Enter your clinic&apos;s email server details. If you use Hostinger, Gmail, or another provider, check their documentation for the SMTP settings.</p>
        </Step>
        <Step number={3} title="Test sending">
          <p>Click <strong>&quot;Send Test Email&quot;</strong> to verify that the configuration is working.</p>
        </Step>
        <Tip>
          <p>Each clinic can have its own SMTP configuration. If not configured, the system uses the platform&apos;s default email server.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function AISection() {
  return (
    <>
      <DocCard title="AI Assistant">
        <p className="text-sm mb-3">
          The AI is the heart of automated customer service. It serves patients via WhatsApp 24 hours a day.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Provider & Model</h4>
        <p className="text-sm mb-2">Choose from three providers:</p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Claude (Anthropic)</strong> — Excellent comprehension and professional tone. Recommended.</li>
          <li><strong>GPT (OpenAI)</strong> — Wide variety of models. GPT-4o Mini is cost-effective.</li>
          <li><strong>Gemini (Google)</strong> — Flash models are fast and cost-effective.</li>
        </ul>
        <p className="text-sm mb-3">
          For each provider, you need an <strong>API Key</strong> (access key), obtained from the provider&apos;s website.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Assistant Identity</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Name</strong> — The name the AI uses (e.g.: &quot;Sofia&quot;)</li>
          <li><strong>Personality</strong> — Behavior description (e.g.: &quot;Friendly, professional, and helpful&quot;)</li>
          <li><strong>Welcome Message</strong> — First message to the patient</li>
          <li><strong>Fallback Message</strong> — When the AI doesn&apos;t understand</li>
          <li><strong>Outside Hours</strong> — Message when the clinic is closed</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Capabilities & Permissions</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Schedule Appointments</strong> — Allows the AI to create appointments automatically</li>
          <li><strong>Confirm Appointments</strong> — Allows confirmation when the patient accepts</li>
          <li><strong>Cancel Appointments</strong> — Allows cancellation at the patient&apos;s request</li>
          <li><strong>Transfer Notification</strong> — Notifies when forwarding to a human</li>
          <li><strong>Business Hours Only</strong> — AI only responds during business hours</li>
          <li><strong>Context Messages</strong> — How many previous messages the AI receives to understand context</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Advanced Instructions</h4>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li><strong>Custom Instructions</strong> — Clinic-specific rules (e.g.: &quot;We have free parking&quot;, &quot;We accept credit cards in 12 installments&quot;)</li>
          <li><strong>Transfer Keywords</strong> — Words that make the AI transfer to a human (e.g.: &quot;complaint, manager&quot;)</li>
          <li><strong>Blocked Topics</strong> — Subjects the AI should not discuss (e.g.: &quot;politics, religion&quot;)</li>
        </ul>
        <Tip>
          <p>The AI already has automatic access to services, prices, dentists, and available schedules. You don&apos;t need to repeat this information in custom instructions.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function InteractiveSection() {
  return (
    <>
      <DocCard title="Interactive Messages">
        <p className="text-sm mb-3">
          Interactive messages are advanced WhatsApp features that allow patients to click on options, buttons, and lists instead of typing.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Available Types</h4>
        <ul className="text-sm space-y-2 list-disc list-inside mb-3">
          <li>
            <strong>Welcome Menu</strong> — When the patient sends &quot;hi&quot; or &quot;hello&quot;, the AI sends a clickable list with options: Schedule, View prices, Reschedule, Cancel, Questions.
          </li>
          <li>
            <strong>Confirmation Buttons</strong> — To confirm appointments, sends buttons: Confirm, Reschedule, Cancel.
          </li>
          <li>
            <strong>Time Slot List</strong> — When scheduling, shows available time slots in a clickable list instead of text.
          </li>
          <li>
            <strong>Satisfaction Survey</strong> — After an appointment, sends a poll: Excellent, Good, Fair, Poor.
          </li>
          <li>
            <strong>Send Location</strong> — When asked for the address, sends a map pin with the clinic&apos;s location.
          </li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">How to Enable</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Go to <strong>Settings &gt; AI &gt; Interactive Messages</strong></li>
          <li>Enable the desired types</li>
          <li>Save the settings</li>
          <li>The AI automatically decides when to use each type</li>
        </ol>
        <Tip>
          <p><strong>To send location:</strong> Configure the clinic&apos;s latitude and longitude in <strong>Settings &gt; My Clinic</strong>. Without this data, the location will not be sent.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function RemindersSection() {
  return (
    <>
      <DocCard title="Automatic Reminders">
        <p className="text-sm mb-3">
          The system automatically sends reminders via WhatsApp before scheduled appointments.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">How it Works</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>The system checks every <strong>5 minutes</strong> for upcoming appointments</li>
          <li><strong>24h reminder</strong> — Sends a message requesting confirmation (YES or NO)</li>
          <li><strong>1h reminder</strong> — Sends a short last-minute reminder</li>
          <li>Each appointment receives at most <strong>one reminder of each type</strong> (no repeats)</li>
          <li>When the patient responds, the AI processes it normally (can confirm or cancel)</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Configuration</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Go to <strong>Settings &gt; Automations</strong></li>
          <li>Enable/disable reminders in general</li>
          <li>Choose which reminders to send (24h, 1h, or both)</li>
          <li>Optionally, customize the messages</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Custom Messages</h4>
        <p className="text-sm mb-2">
          You can create custom messages using variables:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><code className="bg-muted px-1 rounded text-xs">{"{patientName}"}</code> — Patient name</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{date}"}</code> — Appointment date (DD/MM/YYYY)</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{time}"}</code> — Appointment time</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{service}"}</code> — Service name</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{dentist}"}</code> — Dentist name</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{clinicName}"}</code> — Clinic name</li>
        </ul>
        <Tip>
          <p><strong>Example:</strong> &quot;Hi {"{patientName}"}! This is a reminder about your {"{service}"} appointment tomorrow at {"{time}"} with {"{dentist}"}. Please confirm by replying YES.&quot;</p>
        </Tip>
      </DocCard>
    </>
  )
}

function DentistWhatsAppSection() {
  return (
    <>
      <DocCard title="Dentist via WhatsApp">
        <p className="text-sm mb-3">
          Dentists can check their schedule and manage appointments directly via WhatsApp, without needing to access the system.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Prerequisites</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>The dentist must have a <strong>registered phone number</strong> in the system</li>
          <li>The feature must be <strong>enabled</strong> in Settings &gt; AI &gt; Dentist via WhatsApp</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Available Commands</h4>
        <p className="text-sm mb-2">The dentist sends messages via WhatsApp to the clinic&apos;s number:</p>
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">schedule</code>
            <span className="text-sm">View all of today&apos;s appointments</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">week</code>
            <span className="text-sm">View appointments for the next 7 days</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">next</code>
            <span className="text-sm">View the next scheduled patient</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">cancel [name]</code>
            <span className="text-sm">Cancel a patient&apos;s appointment (e.g.: &quot;cancel Maria&quot;)</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">reschedule</code>
            <span className="text-sm">Instructions to reschedule an appointment</span>
          </div>
        </div>
        <Tip>
          <p><strong>How it works:</strong> The system automatically identifies that the message came from a dentist (by phone number) and displays the options menu. The dentist does not need to identify themselves.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function BillingSection() {
  return (
    <>
      <DocCard title="Billing & Plans">
        <p className="text-sm mb-3">
          Manage your clinic&apos;s subscription, view invoices, and track platform usage.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Trial Period</h4>
        <p className="text-sm mb-2">
          When creating an account, you receive a free trial period. During this period, all features are available. When the trial expires, the system enters read-only mode until a plan is subscribed.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Available Plans</h4>
        <p className="text-sm mb-2">
          Go to <strong>Settings &gt; Billing</strong> to see the available plans and their features. Each plan offers different limits for patients, dentists, and features.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Payment</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Payment processed via <strong>Stripe</strong> (credit card)</li>
          <li>Monthly or annual billing (with discount)</li>
          <li>Invoices available for download</li>
          <li>Cancel at any time</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Invoice History</h4>
        <p className="text-sm">
          All invoices are listed in <strong>Settings &gt; Billing</strong> with status (paid, pending, overdue) and download link.
        </p>
        <Tip>
          <p>If the trial period is close to expiring, an alert banner will be displayed on the Dashboard. Subscribe before it expires to avoid losing access.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function SecuritySection() {
  return (
    <>
      <DocCard title="Security & 2FA Authentication">
        <p className="text-sm mb-3">
          Protect your account and clinic with two-factor authentication (2FA) and other security settings.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">2FA Authentication</h4>
        <p className="text-sm mb-2">
          Two-factor authentication adds an extra layer of security to login. In addition to your password, you need to provide a temporary code.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Available Methods</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Authenticator App (TOTP)</strong> — Use Google Authenticator, Authy, or similar. Scan the QR Code to set up.</li>
          <li><strong>WhatsApp</strong> — Receive the verification code via WhatsApp. More convenient, but depends on service availability.</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">How to enable</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Go to <strong>Settings &gt; Security</strong></li>
          <li>Choose your preferred method (TOTP or WhatsApp)</li>
          <li>Follow the setup instructions</li>
          <li>For TOTP: scan the QR Code and enter the verification code</li>
          <li>For WhatsApp: enter the code received on your number</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Clinic 2FA Policy</h4>
        <p className="text-sm mb-2">
          Administrators can set a 2FA policy for the entire clinic:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Optional</strong> — Each user chooses whether to enable it</li>
          <li><strong>Required</strong> — All clinic users must have 2FA enabled</li>
        </ul>
        <Tip>
          <p><strong>Recommendation:</strong> Enable 2FA for all users with access to sensitive patient data. This helps with LGPD (data protection law) compliance.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function PatientPortalSection() {
  return (
    <>
      <DocCard title="Patient Portal">
        <p className="text-sm mb-3">
          The Patient Portal allows patients to access their information without needing to create an account or log in.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">How it works</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Each patient has an automatically generated <strong>unique token</strong></li>
          <li>The portal link can be sent via WhatsApp or email</li>
          <li>By accessing the link, the patient sees their information without needing a password</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">What the patient can see</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Upcoming scheduled appointments</li>
          <li>Previous appointment history</li>
          <li>Personal registration data</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">How to send the link</h4>
        <p className="text-sm mb-2">
          In the patient&apos;s record, click <strong>&quot;Send Portal Link&quot;</strong> to send access via WhatsApp.
        </p>
        <Tip>
          <p>The portal link is secure -- each patient has a unique token that only grants access to their own data. The token does not expire, but can be regenerated if necessary.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function CommandPaletteSection() {
  return (
    <>
      <DocCard title="Quick Search (Cmd+K)">
        <p className="text-sm mb-3">
          The command palette allows you to quickly navigate between pages and search for patients without using the mouse.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">How to use</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Press <strong>Cmd+K</strong> (Mac) or <strong>Ctrl+K</strong> (Windows/Linux)</li>
          <li>Type what you&apos;re looking for: page name, patient, etc.</li>
          <li>Use the arrow keys to navigate and <strong>Enter</strong> to select</li>
          <li>Press <strong>Esc</strong> to close</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">What you can do</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Navigate</strong> — Access any page in the system (Dashboard, Patients, Appointments, Settings, etc.)</li>
          <li><strong>Search patients</strong> — Type the patient&apos;s name to go directly to their record</li>
          <li><strong>Quick actions</strong> — New appointment, new patient, etc.</li>
        </ul>
        <Tip>
          <p>The command palette is the fastest way to navigate the system. Try using <strong>Cmd+K</strong> now!</p>
        </Tip>
      </DocCard>
    </>
  )
}

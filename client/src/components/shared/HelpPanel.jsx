import { BookOpen, LifeBuoy, Mail } from "lucide-react";

export default function HelpPanel() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Help &amp; Support</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700">
            <BookOpen className="w-5 h-5" />
            Getting Started
          </h2>
          <p className="mt-2 text-gray-600">
            Submit a ticket from the dashboard by clicking <strong>Submit Ticket</strong>.
            Provide all required details and track progress in the <em>My Tickets</em>
            section.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700">
            <LifeBuoy className="w-5 h-5" />
            Need Assistance?
          </h2>
          <p className="mt-2 text-gray-600">
            If you encounter issues, contact the IT department or email
            <a href="mailto:support@example.com" className="text-blue-600 underline ml-1">support@example.com</a>.
            We&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 md:col-span-2">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-700">
            <Mail className="w-5 h-5" />
            Frequently Asked Questions
          </h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-gray-600">
            <li>Statuses: <strong>Pending</strong> - waiting for action, <strong>Processing</strong> - being worked on, <strong>Resolved</strong> - finished.</li>
            <li>Manager accounts approve tickets that require manager approval.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
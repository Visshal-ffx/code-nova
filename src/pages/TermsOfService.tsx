import React from 'react';
import { motion } from 'motion/react';
import { FileText, CheckCircle2, AlertTriangle, Scale, UserCheck } from 'lucide-react';

export default function TermsOfService() {
  const sections = [
    {
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      title: "User Eligibility",
      summary: "You must be at least 18 years old to use our service.",
      details: "By using LegalizeAI, you represent that you are of legal age to form a binding contract and that you are not barred from receiving services under the laws of your jurisdiction."
    },
    {
      icon: <Scale className="w-6 h-6 text-primary" />,
      title: "Not Legal Advice",
      summary: "LegalizeAI provides information, not legal advice.",
      details: "Our AI-generated summaries and risk reports are for informational purposes only. We are not a law firm, and our service does not constitute legal advice or create an attorney-client relationship. Always consult with a qualified legal professional for your specific legal needs."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      title: "Acceptable Use",
      summary: "Don't use our tools for illegal or harmful activities.",
      details: "You agree not to use LegalizeAI to analyze documents for illegal purposes, to harass others, or to interfere with the operation of our services. We reserve the right to terminate accounts that violate these terms."
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-primary" />,
      title: "Limitation of Liability",
      summary: "We provide the service 'as is' and aren't liable for legal outcomes.",
      details: "While we strive for accuracy, AI can make mistakes. LegalizeAI is not responsible for any legal decisions you make based on our analysis. Our total liability is limited to the amount you've paid us in the past 12 months."
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Changes to Service",
      summary: "We may update our features or terms from time to time.",
      details: "We're constantly improving LegalizeAI. We may add or remove features, or update these terms. If we make significant changes, we'll notify you via email or through our application."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-slate-600">
            Clear terms for a clearer legal experience.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
            >
              <div className="flex items-start gap-6">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{section.title}</h3>
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4 rounded-r-lg">
                    <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">TL;DR / Simplified</p>
                    <p className="text-slate-700 font-medium">{section.summary}</p>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {section.details}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-12">
          Last Updated: April 4, 2026
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, Share2, UserCheck, Cookie, ShieldAlert, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: "What We Collect",
      summary: "We only collect what's necessary to analyze your documents.",
      details: "When you use LegalizeAI, we collect the text or files you upload for analysis. We also collect basic account information like your email address if you sign up."
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "How We Use Your Data",
      summary: "Your data is used solely to provide and improve our AI analysis.",
      details: "We use your uploaded documents to generate summaries and risk reports. We do not use your private legal documents to train our public AI models without your explicit consent."
    },
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: "Data Retention",
      summary: "You control how long we keep your documents.",
      details: "By default, we store your analysis history so you can access it later. You can delete any document or your entire account at any time, which permanently removes your data from our active servers."
    },
    {
      icon: <Share2 className="w-6 h-6 text-primary" />,
      title: "Third-Party Sharing",
      summary: "We never sell your personal legal data to advertisers.",
      details: "We do not sell, rent, or trade your documents or personal information. We only share data with essential service providers (like our AI infrastructure partners) who are contractually bound to protect your privacy."
    },
    {
      icon: <Cookie className="w-6 h-6 text-primary" />,
      title: "Cookies & Tracking",
      summary: "We use cookies to keep you logged in and improve performance.",
      details: "We use essential cookies to manage your session and remember your preferences. We do not use invasive tracking cookies or sell your browsing history to third parties."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-primary" />,
      title: "Security Measures",
      summary: "We use industry-standard encryption to protect your files.",
      details: "All documents uploaded to LegalizeAI are encrypted in transit using SSL/TLS and at rest. We regularly audit our security practices to ensure your legal data remains confidential."
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Children's Privacy",
      summary: "Our service is not intended for children under 13.",
      details: "LegalizeAI does not knowingly collect personal information from children under the age of 13. If we discover such data has been collected, we will delete it immediately."
    },
    {
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      title: "Your Rights",
      summary: "You have full control over your information.",
      details: "You have the right to access, correct, or delete your personal data. You can exercise these rights directly through your account dashboard or by contacting our support team."
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">
            At LegalizeAI, we believe privacy policies should be as clear as the documents we help you analyze.
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
                  <div className="bg-blue-50 border-l-4 border-primary p-3 mb-4 rounded-r-lg">
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">TL;DR / Simplified</p>
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

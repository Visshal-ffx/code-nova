import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Info, CheckCircle, ShieldAlert, Zap, Globe, FileWarning, Search } from 'lucide-react';

export default function HelpPage() {
  const technicalErrors = [
    {
      title: "API Key Missing",
      explanation: "The 'brain' of the app (the AI) needs a special key to work. If you see this, it means the connection to our AI engine hasn't been set up yet.",
      solution: "This is usually a configuration issue. Please contact support or check your environment settings."
    },
    {
      title: "Analysis Failed / Empty Response",
      explanation: "Sometimes the AI is busy or the document is too complex to process in one go. It's like a person getting overwhelmed by too much information.",
      solution: "Try refreshing the page or pasting a smaller section of the document at a time."
    },
    {
      title: "URL Fetching Limited (CORS)",
      explanation: "Web browsers have strict security rules (called CORS) that prevent one website from reading another website's content directly without permission.",
      solution: "The best way to analyze a website's terms is to copy the text from that site and paste it directly into our 'Paste Text' box."
    }
  ];

  const legalRisks = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "High Risk (Red Flags)",
      explanation: "These are critical clauses that could significantly impact your rights. Examples include giving away ownership of your content or agreeing to mandatory arbitration that prevents you from going to court.",
      advice: "We strongly recommend reading these sections carefully and potentially consulting a human lawyer before signing."
    },
    {
      icon: <Info className="w-6 h-6 text-amber-500" />,
      title: "Medium Risk (Yellow Flags)",
      explanation: "These are important but common clauses. They might involve auto-renewals, hidden fees, or data sharing with partners.",
      advice: "Make sure you're comfortable with these terms. They are often negotiable or standard, but you should be aware of them."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      title: "Low Risk (Green Flags)",
      explanation: "These are standard legal protections that are fair to both parties. They usually describe how the service works without taking away your basic rights.",
      advice: "These are generally safe, but it's always good to have a quick summary of what they cover."
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
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Understanding Your Analysis</h1>
          <p className="text-lg text-slate-600">
            We've broken down the most common technical and legal terms to help you navigate your reports with confidence.
          </p>
        </motion.div>

        {/* Legal Risks Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-primary" />
            What do the Risk Levels mean?
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {legalRisks.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
              >
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    {risk.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{risk.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{risk.explanation}</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Our Advice</p>
                      <p className="text-slate-700 text-sm italic">{risk.advice}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technical Errors Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <Zap className="w-7 h-7 text-primary" />
            Common Technical Issues
          </h2>
          <div className="space-y-6">
            {technicalErrors.map((error, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FileWarning className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-slate-900">{error.title}</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{error.explanation}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-3 py-2 rounded-lg w-fit">
                  <Globe className="w-3 h-3" />
                  Solution: {error.solution}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mt-16 p-10 bg-slate-900 rounded-[3rem] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20" />
          <h3 className="text-2xl font-bold mb-4">Still confused?</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Our AI is constantly learning. If you encounter an error not listed here, try re-uploading your document or breaking it into smaller parts.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

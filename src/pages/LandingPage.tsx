import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, Lock, Search, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-primary border border-blue-100 mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Advanced Gemini AI
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
              Understand Legal Documents <br />
              <span className="gradient-text">In Seconds, Not Hours.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Stop blindly clicking "I Agree". LegalizeAI translates complex Terms of Service, Privacy Policies, and Contracts into plain English while highlighting hidden risks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-dark transition-all shadow-xl hover:shadow-2xl flex items-center justify-center group"
              >
                Try Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center"
              >
                How it Works
              </Link>
            </div>
          </motion.div>

          {/* Hero Image / Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative max-w-4xl mx-auto"
          >
            <div className="glass-card rounded-3xl p-6 shadow-2xl overflow-hidden border-slate-200 bg-white">
              <div className="flex gap-8">
                {/* Scanned Document Mockup */}
                <div className="flex-1 bg-slate-50 rounded-xl p-8 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-scan" />
                  <div className="space-y-4">
                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-4 w-full bg-red-100 border-l-4 border-red-500 p-1 rounded-r">
                      <span className="text-[10px] font-bold text-red-600 uppercase ml-2">Dangerous Clause Detected</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-5/6 bg-slate-100 rounded" />
                    <div className="h-4 w-full bg-red-100 border-l-4 border-red-500 p-1 rounded-r">
                      <span className="text-[10px] font-bold text-red-600 uppercase ml-2">Hidden Data Sharing</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded" />
                  </div>
                </div>

                {/* AI Analysis Overlay */}
                <div className="w-72 hidden md:flex flex-col gap-4">
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-bold text-red-900">High Risk Detected</span>
                    </div>
                    <p className="text-xs text-red-700 leading-relaxed">
                      This document contains clauses that allow third-party data sharing without your explicit consent.
                    </p>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">AI Summary</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Auto-renewal active after 12 months. Mandatory arbitration in Delaware.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase">Risk Detected</p>
                  <p className="text-sm font-bold text-slate-900">Data Sharing Clause</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features for Legal Clarity</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Our AI engine is trained on thousands of legal documents to give you the most accurate analysis possible.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-8 h-8 text-primary" />,
                title: "AI Risk Detection",
                desc: "Automatically scan for arbitration clauses, hidden fees, and data sharing risks."
              },
              {
                icon: <FileText className="w-8 h-8 text-primary" />,
                title: "Plain English Summary",
                desc: "Get a concise, jargon-free summary of exactly what you're signing up for."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                title: "Privacy Risk Scanner",
                desc: "Understand how your personal data is handled, stored, and sold."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl transition-all"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Three Steps to Peace of Mind</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Upload or Paste", desc: "Upload a PDF/DOCX or simply paste the text of any legal document." },
                  { step: "02", title: "AI Analysis", desc: "Our advanced AI models scan the text for jargon and hidden risks." },
                  { step: "03", title: "Get Your Report", desc: "Receive a clear, actionable report with risk scores and summaries." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <span className="text-4xl font-black text-slate-200">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary rounded-3xl aspect-square rotate-3 absolute inset-0 opacity-10" />
              <div className="glass-card rounded-3xl p-8 relative">
                <div className="space-y-6">
                  <div className="h-4 w-3/4 bg-slate-100 rounded-full animate-pulse" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded-full animate-pulse" />
                  <div className="h-32 w-full bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full animate-pulse" />
                  <div className="h-4 w-2/3 bg-slate-100 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-[120px] opacity-20" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">
              Ready to stop guessing? <br />
              Start your first analysis today.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-primary-dark transition-all shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



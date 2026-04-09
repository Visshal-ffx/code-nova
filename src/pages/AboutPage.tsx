import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-8"
          >
            We're on a mission to <br />
            <span className="gradient-text">Democratize the Law.</span>
          </motion.h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Legal documents are intentionally complex. We believe everyone deserves to understand what they're signing, without needing a law degree.
          </p>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShieldCheck className="w-10 h-10 text-primary" />,
                title: "Transparency First",
                desc: "We reveal what companies hide in the fine print, giving you the power to make informed decisions."
              },
              {
                icon: <Zap className="w-10 h-10 text-primary" />,
                title: "AI-Powered Speed",
                desc: "What used to take hours of reading now takes seconds of processing, thanks to cutting-edge Gemini AI."
              },
              {
                icon: <Users className="w-10 h-10 text-primary" />,
                title: "User Centric",
                desc: "Our tools are built for humans, not lawyers. We focus on clarity, simplicity, and actionable insights."
              }
            ].map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-sm mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Why We Built LegalizeAI</h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p>
                  It started with a 40-page Terms of Service agreement for a simple fitness app. We realized that almost no one actually reads these documents, yet they govern our digital lives.
                </p>
                <p>
                  Hidden within those pages were clauses about data selling and mandatory arbitration that were nearly impossible to cancel.
                </p>
                <p>
                  We saw an opportunity to use AI to bridge the gap between legal jargon and human understanding. LegalizeAI was born to be your personal legal assistant.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-[3rem] rotate-3" />
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000"
                  alt="Legal concept"
                  className="rounded-[3rem] shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

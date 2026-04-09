import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Info, FileText, Share2, Download, Copy, ShieldCheck } from 'lucide-react';
import type { LegalAnalysis } from '@/src/services/geminiService';
import { cn } from '@/src/lib/utils';
import ReactMarkdown from 'react-markdown';

interface AnalysisResultProps {
  analysis: LegalAnalysis;
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Info className="w-5 h-5 text-amber-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const copySummary = () => {
    navigator.clipboard.writeText(analysis.summary);
    // In a real app, show a toast
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header / Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cn(
          "md:col-span-2 p-6 rounded-2xl border flex flex-col justify-center",
          getRiskColor(analysis.riskLevel)
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Overall Risk: {analysis.riskLevel}</h3>
            <div className="flex space-x-2">
              <button onClick={copySummary} className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="Copy Summary">
                <Copy className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="Download PDF">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/50 rounded-lg transition-colors" title="Share">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-lg opacity-90 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeDasharray="100, 100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={cn(
                  analysis.riskScore > 70 ? "text-red-500" : analysis.riskScore > 30 ? "text-amber-500" : "text-emerald-500"
                )}
                strokeDasharray={`${analysis.riskScore}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{analysis.riskScore}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Risk Score</span>
              <Link to="/help" className="text-[8px] text-primary hover:underline mt-1">What does this mean?</Link>
            </div>
          </div>
          <p className="text-sm text-slate-500">Based on {analysis.keyRisks.length} identified risk factors</p>
        </div>
      </div>

      {/* Key Risks */}
      <section>
        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Key Risks Identified
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.keyRisks.map((risk, idx) => (
            <div key={idx} className="glass-card p-5 rounded-xl border-l-4 border-l-primary flex gap-4">
              <div className="mt-1">{getSeverityIcon(risk.severity)}</div>
              <div>
                <h5 className="font-bold text-slate-900 mb-1">{risk.title}</h5>
                <p className="text-sm text-slate-600 leading-relaxed">{risk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Clauses */}
      <section>
        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Important Clauses Explained
        </h4>
        <div className="space-y-4">
          {analysis.importantClauses.map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-xl">
              <h5 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">Clause: {item.clause}</h5>
              <div className="text-slate-600 prose prose-sm max-w-none">
                <ReactMarkdown>{item.explanation}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real World Impact */}
      <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          What This Means For You
        </h4>
        <p className="text-slate-300 leading-relaxed text-lg">
          {analysis.realWorldImpact}
        </p>
      </section>
    </motion.div>
  );
}

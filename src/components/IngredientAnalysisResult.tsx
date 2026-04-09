import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Info, ShieldCheck, Beaker, ClipboardList } from 'lucide-react';
import type { IngredientAnalysis } from '@/src/services/geminiService';
import { cn } from '@/src/lib/utils';

interface IngredientAnalysisResultProps {
  analysis: IngredientAnalysis;
}

export default function IngredientAnalysisResult({ analysis }: IngredientAnalysisResultProps) {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <Info className="w-5 h-5 text-amber-500" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Safety Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card p-8 rounded-3xl border-l-8 border-l-primary flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            General Safety Advice
          </h3>
          <p className="text-lg text-slate-700 leading-relaxed italic">
            "{analysis.advice}"
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center text-center">
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
                  analysis.safety_score < 40 ? "text-red-500" : analysis.safety_score < 70 ? "text-amber-500" : "text-emerald-500"
                )}
                strokeDasharray={`${analysis.safety_score}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{analysis.safety_score}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Safety Score</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Product Safety Rating</p>
        </div>
      </div>

      {/* Key Risks */}
      {analysis.keyRisks && analysis.keyRisks.length > 0 && (
        <section>
          <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Key Safety Risks Identified
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.keyRisks.map((risk, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border-l-4 border-l-primary flex gap-4">
                <div className="mt-1">{getRiskIcon(risk.severity)}</div>
                <div>
                  <h5 className="font-bold text-slate-900 mb-1">{risk.title}</h5>
                  <p className="text-sm text-slate-600 leading-relaxed">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ingredients Breakdown */}
      <section>
        <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-primary" />
          Ingredient Safety Breakdown
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {analysis.ingredients.map((ing, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                    <ClipboardList className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                  </div>
                  <h5 className="text-lg font-bold text-slate-900">{ing.name}</h5>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border w-fit",
                  getRiskColor(ing.risk)
                )}>
                  {getRiskIcon(ing.risk)}
                  {ing.risk} Risk
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What is it?</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{ing.explanation}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Possible Side Effects</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{ing.side_effects || "No significant side effects known for general use."}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

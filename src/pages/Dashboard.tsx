import React from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Link as LinkIcon, Send, Loader2, History, Trash2, AlertCircle, Camera, Type as TypeIcon, CheckCircle, File, Info, Volume2, ShieldCheck, Beaker } from 'lucide-react';
import { analyzeLegalText, analyzeLegalDocumentFile, analyzeIngredients, type LegalAnalysis, type IngredientAnalysis } from '@/src/services/geminiService';
import AnalysisResult from '@/src/components/AnalysisResult';
import IngredientAnalysisResult from '@/src/components/IngredientAnalysisResult';
import VoiceAssistant from '@/src/components/HybridVoiceAssistant';
import { cn } from '@/src/lib/utils';

export default function Dashboard() {
  const [analysisType, setAnalysisType] = React.useState<'legal' | 'ingredients'>('legal');
  const [inputMode, setInputMode] = React.useState<'paste' | 'upload' | 'url' | 'image'>('paste');
  const [text, setText] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [image, setImage] = React.useState<{ base64: string; mimeType: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [legalResult, setLegalResult] = React.useState<LegalAnalysis | null>(null);
  const [ingredientResult, setIngredientResult] = React.useState<IngredientAnalysis | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<{ id: string; name: string; date: string; type: 'legal' | 'ingredients'; result: any }[]>([]);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = React.useState(false);
  const [voiceAssistantInitialMessage, setVoiceAssistantInitialMessage] = React.useState<string | undefined>(undefined);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
          const base64 = content.split(',')[1];
          setImage({ base64, mimeType: file.type });
          setInputMode('image');
        } else {
          setText(content);
          setInputMode('paste');
        }
      };
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (inputMode === 'paste' && !text.trim()) return;
    if (inputMode === 'image' && !image) return;
    
    setIsAnalyzing(true);
    setError(null);
    setLegalResult(null);
    setIngredientResult(null);
    setVoiceAssistantInitialMessage(undefined);

    try {
      if (analysisType === 'legal') {
        let analysis: LegalAnalysis;
        if (inputMode === 'image' && image) {
          analysis = await analyzeLegalDocumentFile(image.base64, image.mimeType);
        } else {
          analysis = await analyzeLegalText(text);
        }
        setLegalResult(analysis);
        
        const newHistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: inputMode === 'image' ? "Legal Scan" : (text.substring(0, 30) + "..."),
          date: new Date().toLocaleDateString(),
          type: 'legal' as const,
          result: analysis
        };
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      } else {
        let analysis: IngredientAnalysis;
        if (inputMode === 'image' && image) {
          analysis = await analyzeIngredients(image.base64, true, image.mimeType);
        } else {
          analysis = await analyzeIngredients(text);
        }
        setIngredientResult(analysis);

        const newHistoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: inputMode === 'image' ? "Ingredient Scan" : (text.substring(0, 30) + "..."),
          date: new Date().toLocaleDateString(),
          type: 'ingredients' as const,
          result: analysis
        };
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setText('');
    setUrl('');
    setImage(null);
    setLegalResult(null);
    setIngredientResult(null);
    setError(null);
  };

  const loadFromHistory = (item: any) => {
    setAnalysisType(item.type);
    if (item.type === 'legal') {
      setLegalResult(item.result);
      setIngredientResult(null);
    } else {
      setIngredientResult(item.result);
      setLegalResult(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Feature Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner">
          <button
            onClick={() => { setAnalysisType('legal'); clearAll(); }}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              analysisType === 'legal' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ShieldCheck className="w-4 h-4" />
            Legal Document Analysis
          </button>
          <button
            onClick={() => { setAnalysisType('ingredients'); clearAll(); }}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              analysisType === 'ingredients' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Beaker className="w-4 h-4" />
            Ingredient Safety Checker
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar / History */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Recent Analyses
            </h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No recent history</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {item.type === 'legal' ? <ShieldCheck className="w-3 h-3 text-primary" /> : <Beaker className="w-3 h-3 text-primary" />}
                      <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                    </div>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h4 className="font-bold text-primary mb-2">Quick Tip</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {analysisType === 'legal' 
                ? "Pasting the full text of a Privacy Policy usually gives the most accurate results."
                : "You can upload a photo of the ingredients list on any product for instant safety analysis."}
            </p>
            <Link 
              to="/help" 
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              Understanding your report
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card rounded-3xl p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {analysisType === 'legal' ? "Legal Document Simplifier" : "Ingredient Safety Expert"}
              </h2>
              <p className="text-slate-500 text-sm">
                {analysisType === 'legal' 
                  ? "Translate complex legalese into plain English instantly." 
                  : "Check food, health, and cosmetic ingredients for potential risks."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={() => setInputMode('paste')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                  inputMode === 'paste' ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <FileText className="w-4 h-4" />
                Paste Text
              </button>
              <button
                onClick={() => setInputMode('upload')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                  inputMode === 'upload' ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
              {analysisType === 'legal' && (
                <button
                  onClick={() => setInputMode('url')}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                    inputMode === 'url' ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  <LinkIcon className="w-4 h-4" />
                  Paste URL
                </button>
              )}
              <button
                onClick={() => setInputMode('image')}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                  inputMode === 'image' ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Camera className="w-4 h-4" />
                {analysisType === 'legal' ? "Advanced Document Analysis" : "Scan Ingredients Label"}
              </button>
              
              <div className="ml-auto">
                <button
                  onClick={clearAll}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {inputMode === 'paste' && (
                <motion.div
                  key="paste"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={analysisType === 'legal' ? "Paste your Terms of Service or legal text here..." : "Paste the list of ingredients here (e.g., Sodium Laureth Sulfate, Parabens...)"}
                    className="w-full h-64 p-6 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-slate-700 font-sans"
                  />
                </motion.div>
              )}

              {inputMode === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div
                    {...getRootProps()}
                    className={cn(
                      "w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer",
                      isDragActive ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-bold text-slate-900">Click or drag file to upload</p>
                    <p className="text-sm text-slate-500 mt-2">Supports PDF, DOCX, TXT (Max 5MB)</p>
                    {text && (
                      <p className="mt-4 text-emerald-600 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        File loaded successfully
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {inputMode === 'url' && (
                <motion.div
                  key="url"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/terms"
                      className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-700">
                      URL analysis may be limited by website security. If it fails, please copy and paste the text directly.
                    </p>
                  </div>
                </motion.div>
              )}

              {inputMode === 'image' && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div
                    {...getRootProps()}
                    className={cn(
                      "w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer",
                      isDragActive ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    )}
                  >
                    <input {...getInputProps()} />
                    {image ? (
                      <div className="relative w-full h-full p-4 flex items-center justify-center">
                        {image.mimeType === 'application/pdf' ? (
                          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-slate-200">
                            <File className="w-16 h-16 text-primary mb-4" />
                            <p className="font-bold text-slate-900">PDF Document Loaded</p>
                            <p className="text-xs text-slate-500">Ready for analysis</p>
                          </div>
                        ) : (
                          <img 
                            src={`data:${image.mimeType};base64,${image.base64}`} 
                            alt="Document Preview" 
                            className="max-h-full rounded-lg shadow-lg"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                          <Camera className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {analysisType === 'legal' ? "Upload document (Image or PDF) for advanced analysis" : "Upload a photo of the ingredients label"}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">Supports PDF, JPG, PNG, WEBP</p>
                      </>
                    )}
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex gap-3">
                    <TypeIcon className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-sm text-slate-700">
                      {analysisType === 'legal' 
                        ? "Our advanced AI will analyze the document structure, extract text accurately, and identify legal risks from your file."
                        : "Our AI will scan the label, identify each ingredient, and provide a detailed safety report."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (inputMode === 'paste' && !text.trim()) || (inputMode === 'url' && !url.trim()) || (inputMode === 'image' && !image)}
                className={cn(
                  "px-10 py-4 rounded-full text-lg font-bold transition-all flex items-center gap-3 shadow-xl",
                  isAnalyzing || (inputMode === 'paste' && !text.trim()) || (inputMode === 'url' && !url.trim()) || (inputMode === 'image' && !image)
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark hover:shadow-2xl"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Analyze Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-red-50 border border-red-100 rounded-3xl flex gap-4 items-center text-red-700"
            >
              <AlertCircle className="w-8 h-8 shrink-0" />
              <div className="flex-1">
                <p className="font-bold">Analysis Failed</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
              <Link
                to="/help"
                className="px-4 py-2 bg-white border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50 transition-all shrink-0"
              >
                Need Help?
              </Link>
            </motion.div>
          )}

          {/* Results Section */}
          <AnimatePresence>
            {legalResult && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 border-t border-slate-200"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Legal Analysis Report</h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const risksSummary = legalResult.keyRisks.map(r => `${r.title}`).join(', ');
                        const fullExplanation = `Your document has a ${legalResult.riskLevel} risk level. ${legalResult.summary} The main risks identified are: ${risksSummary}. You can ask me for more details about any of these risks.`;
                        setVoiceAssistantInitialMessage(fullExplanation);
                        setIsVoiceAssistantOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary/20 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen to Summary
                    </button>
                    <span className="text-sm text-slate-500">Generated just now</span>
                  </div>
                </div>
                <AnalysisResult analysis={legalResult} />
              </motion.div>
            )}

            {ingredientResult && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 border-t border-slate-200"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Ingredient Safety Report</h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const fullExplanation = `I've analyzed the ingredients. The overall safety score is ${ingredientResult.safety_score} out of 100. ${ingredientResult.advice}`;
                        setVoiceAssistantInitialMessage(fullExplanation);
                        setIsVoiceAssistantOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary/20 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      Listen to Advice
                    </button>
                    <span className="text-sm text-slate-500">Generated just now</span>
                  </div>
                </div>
                <IngredientAnalysisResult analysis={ingredientResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <VoiceAssistant 
        isOpen={isVoiceAssistantOpen} 
        onClose={() => {
          setIsVoiceAssistantOpen(false);
          setVoiceAssistantInitialMessage(undefined);
        }}
        initialMessage={voiceAssistantInitialMessage}
        context={
          legalResult 
            ? `Legal Summary: ${legalResult.summary}. Risk Level: ${legalResult.riskLevel}. Risk Score: ${legalResult.riskScore}/100. Key Risks: ${legalResult.keyRisks.map(r => `${r.title} (${r.severity} severity): ${r.description}`).join('; ')}.` 
            : ingredientResult 
              ? `Ingredient Safety Summary: Safety Score ${ingredientResult.safety_score}/100. Advice: ${ingredientResult.advice}. Ingredients: ${ingredientResult.ingredients.map(i => `${i.name} (${i.risk} risk): ${i.explanation}`).join('; ')}.`
              : undefined
        }
      />
    </div>
  );
}

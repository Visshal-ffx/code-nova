import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Mic, MicOff, X, Volume2, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface HybridVoiceAssistantProps {
  context?: string;
  initialMessage?: string;
  isOpen: boolean;
  onClose: () => void;
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

export default function HybridVoiceAssistant({ context, initialMessage, isOpen, onClose }: HybridVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const speakText = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || 
                           voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setAiResponse(text);
  }, []);

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
  };

  const playAudio = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const binary = atob(base64Audio);
      const arrayBuffer = new ArrayBuffer(binary.length);
      const view = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binary.length; i++) {
        view[i] = binary.charCodeAt(i);
      }

      // The TTS model returns raw PCM or encoded audio depending on config.
      // For gemini-2.5-flash-preview-tts, it's usually PCM with sample rate 24000
      // But we can also just use decodeAudioData if it's a standard format
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer).catch(async () => {
        // If decode fails, it might be raw PCM 16-bit
        const pcm16 = new Int16Array(arrayBuffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768.0;
        }
        const buffer = audioContextRef.current!.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);
        return buffer;
      });

      stopAudio();
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      audioSourceRef.current = source;
    } catch (err) {
      console.error("Error playing audio:", err);
    }
  };

  const handleAiResponse = async (userText: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
      if (!GEMINI_API_KEY) {
        throw new Error("API Key is missing. Please check your configuration.");
      }
      
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      // 1. Generate Text Response using a stable model
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ 
          parts: [{ 
            text: `The user said: "${userText}". 
            Context: ${context || "No document analyzed yet."}
            Respond briefly and clearly to the user's question about the legal document.
            Keep it under 3 sentences. Be professional and helpful.` 
          }] 
        }]
      });

      const textPart = response.text;

      if (textPart) {
        speakText(textPart);
      } else {
        throw new Error("Empty response from AI.");
      }

    } catch (err) {
      console.error("AI Error:", err);
      setError(err instanceof Error ? `AI Error: ${err.message}` : "Failed to get response from AI.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          handleAiResponse(transcriptText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error !== 'no-speech') {
          setError(`Microphone error: ${event.error}`);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript("");
      setAiResponse("");
      setError(null);
      stopAudio();
    } catch (err) {
      console.error("Failed to start recognition:", err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  useEffect(() => {
    if (isOpen && initialMessage) {
      speakText(initialMessage);
    }
  }, [isOpen, initialMessage, speakText]);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopAudio();
      window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[60] w-full max-w-sm"
        >
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">LegalizeAI Voice</h3>
                  <p className="text-[10px] text-slate-400">
                    {isListening ? "Listening..." : isProcessing ? "Thinking..." : "Ready"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[250px] flex flex-col justify-center items-center text-center">
              {error ? (
                <div className="text-red-500 space-y-4">
                  <p className="font-medium">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      startListening();
                    }}
                    className="text-sm underline hover:text-red-600"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="w-full space-y-8">
                  <div className="flex justify-center">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className="relative group"
                    >
                      <AnimatePresence>
                        {isListening && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-primary rounded-full blur-2xl"
                          />
                        )}
                      </AnimatePresence>
                      <div className={cn(
                        "relative w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-300",
                        isListening ? "bg-primary text-white scale-110" : "bg-slate-50 text-slate-400 hover:text-primary hover:bg-white"
                      )}>
                        <Mic className={cn("w-10 h-10", isListening && "animate-pulse")} />
                      </div>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="min-h-[60px]">
                      {transcript && (
                        <p className="text-slate-500 italic text-sm mb-2">
                          "{transcript}"
                        </p>
                      )}
                      {isProcessing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          <span className="text-slate-600 font-medium">Processing...</span>
                        </div>
                      ) : (
                        <p className="text-slate-900 font-medium text-lg leading-relaxed">
                          {aiResponse || "Tap the mic and ask me anything about your document."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Powered by Google Gemini & Web Speech API
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Mic, MicOff, X, Volume2, VolumeX, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface VoiceAssistantProps {
  context?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceAssistant({ context, isOpen, onClose }: VoiceAssistantProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const stopAssistant = useCallback(async () => {
    if (sessionRef.current) {
      await sessionRef.current.close();
      sessionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
    setTranscription("");
    setAiResponse("");
  }, []);

  const startAssistant = useCallback(async () => {
    try {
      const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
      }

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      
      // Initialize Audio Context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      nextPlayTimeRef.current = audioContextRef.current.currentTime;

      // Get Microphone Stream
      streamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });

      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      
      // ScriptProcessorNode for audio capture
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      const sessionPromise = ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            console.log("Live API: Connected");
            setIsConnected(true);
            setIsListening(true);
            setError(null);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle model turn content
            if (message.serverContent?.modelTurn) {
              const parts = message.serverContent.modelTurn.parts;
              for (const part of parts) {
                // Handle audio output
                if (part.inlineData?.data && audioContextRef.current) {
                  const base64Audio = part.inlineData.data;
                  const binary = atob(base64Audio);
                  const bytes = new Int16Array(binary.length / 2);
                  for (let i = 0; i < bytes.length; i++) {
                    bytes[i] = (binary.charCodeAt(i * 2) & 0xFF) | (binary.charCodeAt(i * 2 + 1) << 8);
                  }
                  
                  const float32Data = new Float32Array(bytes.length);
                  for (let i = 0; i < bytes.length; i++) {
                    float32Data[i] = bytes[i] / 32768.0;
                  }

                  const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 16000);
                  buffer.getChannelData(0).set(float32Data);

                  const source = audioContextRef.current.createBufferSource();
                  source.buffer = buffer;
                  source.connect(audioContextRef.current.destination);
                  
                  const startTime = Math.max(nextPlayTimeRef.current, audioContextRef.current.currentTime);
                  source.start(startTime);
                  nextPlayTimeRef.current = startTime + buffer.duration;
                }

                // Handle text output (transcription)
                if (part.text) {
                  setAiResponse(prev => prev + part.text);
                }
              }
            }

            // Handle interruptions
            if (message.serverContent?.interrupted) {
              console.log("Live API: Interrupted");
              nextPlayTimeRef.current = audioContextRef.current?.currentTime || 0;
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError(`Connection error: ${err.message || "Unknown error"}. Please try again.`);
            stopAssistant();
          },
          onclose: (event) => {
            console.log("Live API: Closed", event);
            setIsConnected(false);
            setIsListening(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are a helpful legal assistant for LegalizeAI. 
          Your goal is to help users understand legal documents. 
          Be concise, professional, and clear. 
          Avoid giving actual legal advice, but explain terms and concepts.
          ${context ? `The user is currently looking at this document analysis: ${context}` : ""}
          `,
        },
      });

      sessionRef.current = await sessionPromise;

      processorRef.current.onaudioprocess = (e) => {
        if (!isMuted && sessionRef.current && isConnected) {
          const inputData = e.inputBuffer.getChannelData(0);
          // Convert Float32 to Int16 PCM
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
          }
          
          // Safer base64 conversion
          const uint8Array = new Uint8Array(pcmData.buffer);
          let binary = '';
          for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          const base64Data = btoa(binary);

          sessionRef.current.sendRealtimeInput({
            audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
        }
      };

    } catch (err) {
      console.error("Failed to start voice assistant:", err);
      setError(err instanceof Error ? err.message : "Failed to access microphone or establish connection.");
      setIsConnected(false);
    }
  }, [context, isMuted, isConnected, stopAssistant]);

  useEffect(() => {
    if (isOpen) {
      startAssistant();
    } else {
      stopAssistant();
    }
    return () => {
      stopAssistant();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[60] w-full max-w-md"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={cn(
                    "w-10 h-10 rounded-full bg-primary flex items-center justify-center",
                    isConnected && "animate-pulse"
                  )}>
                    <Volume2 className="w-6 h-6" />
                  </div>
                  {isConnected && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold">LegalizeAI Assistant</h3>
                  <p className="text-xs text-slate-400">
                    {isConnected ? "Listening..." : "Connecting..."}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[300px] flex flex-col justify-center items-center text-center">
              {error ? (
                <div className="text-red-500 space-y-4">
                  <p className="font-medium">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      startAssistant();
                    }}
                    className="text-sm underline hover:text-red-600"
                  >
                    Try again
                  </button>
                </div>
              ) : !isConnected ? (
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-slate-600 font-medium">Setting up secure voice link...</p>
                </div>
              ) : (
                <div className="w-full space-y-8">
                  <div className="flex justify-center">
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: isListening && !isMuted ? [1, 1.2, 1] : 1,
                          opacity: isListening && !isMuted ? [0.5, 1, 0.5] : 0.5,
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-primary rounded-full blur-2xl"
                      />
                      <div className="relative bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                        {isMuted ? (
                          <MicOff className="w-10 h-10 text-slate-400" />
                        ) : (
                          <Mic className="w-10 h-10 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-slate-900 font-medium text-lg">
                      {aiResponse || "How can I help you understand this document?"}
                    </p>
                    <p className="text-slate-400 text-sm italic">
                      {isMuted ? "Microphone muted" : "Speak now, I'm listening..."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center space-x-6">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={cn(
                  "p-4 rounded-full transition-all shadow-sm",
                  isMuted ? "bg-red-50 text-red-500" : "bg-white text-slate-600 hover:text-primary"
                )}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button
                onClick={onClose}
                className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                End Session
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

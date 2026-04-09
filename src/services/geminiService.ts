import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export interface LegalAnalysis {
  summary: string;
  keyRisks: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  riskScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  importantClauses: {
    clause: string;
    explanation: string;
  }[];
  realWorldImpact: string;
}

export async function analyzeLegalText(text: string): Promise<LegalAnalysis> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following legal text and provide a simplified breakdown. 
    Focus on identifying hidden risks, translating jargon, and explaining the real-world impact.
    
    Legal Text:
    ${text.substring(0, 30000)} // Limit to 30k chars for safety
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A simple English summary of the document." },
          keyRisks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
              },
              required: ["title", "description", "severity"]
            }
          },
          riskScore: { type: Type.INTEGER, description: "A score from 0 to 100 representing overall risk." },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          importantClauses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                clause: { type: Type.STRING, description: "The original or identified clause name." },
                explanation: { type: Type.STRING, description: "What this clause means in plain English." }
              },
              required: ["clause", "explanation"]
            }
          },
          realWorldImpact: { type: Type.STRING, description: "A summary of what this document means for the user in practice." }
        },
        required: ["summary", "keyRisks", "riskScore", "riskLevel", "importantClauses", "realWorldImpact"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Failed to get a response from the AI.");
  }

  try {
    return JSON.parse(resultText) as LegalAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response:", resultText);
    throw new Error("Failed to parse the analysis result.");
  }
}

export async function analyzeLegalDocumentFile(base64Data: string, mimeType: string): Promise<LegalAnalysis> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: `Analyze this legal document (${mimeType}). 
          1. Extract all text accurately. Ensure high precision in OCR.
          2. Identify hidden risks, translate jargon, and explain the real-world impact.
          
          Provide the output in JSON format according to the schema. Be as accurate as possible with text extraction.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A simple English summary of the document." },
          keyRisks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
              },
              required: ["title", "description", "severity"]
            }
          },
          riskScore: { type: Type.INTEGER, description: "A score from 0 to 100 representing overall risk." },
          riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          importantClauses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                clause: { type: Type.STRING, description: "The original or identified clause name." },
                explanation: { type: Type.STRING, description: "What this clause means in plain English." }
              },
              required: ["clause", "explanation"]
            }
          },
          realWorldImpact: { type: Type.STRING, description: "A summary of what this document means for the user in practice." }
        },
        required: ["summary", "keyRisks", "riskScore", "riskLevel", "importantClauses", "realWorldImpact"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Failed to get a response from the AI.");
  }

  try {
    return JSON.parse(resultText) as LegalAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response:", resultText);
    throw new Error("Failed to parse the analysis result.");
  }
}

export async function fetchUrlContent(url: string): Promise<string> {
  // In a real production app, we'd use a proxy or a server-side fetcher to bypass CORS and extract text.
  // For this demo, we'll simulate fetching or use a public API if available.
  // Since we are in a sandboxed environment, we can't easily fetch arbitrary URLs from the client due to CORS.
  // We'll suggest the user paste the text if the URL fetch fails.
  throw new Error("URL fetching is currently limited by CORS. Please paste the text directly for analysis.");
}

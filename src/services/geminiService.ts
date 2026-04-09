import { GoogleGenAI, Type } from "@google/genai";

// This variable is populated from process.env.GEMINI_API_KEY at build time via vite.config.ts
// On Netlify, ensure you set GEMINI_API_KEY in the Site Settings > Environment Variables.
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

export interface IngredientAnalysis {
  ingredients: {
    name: string;
    risk: 'Low' | 'Medium' | 'High';
    side_effects: string;
    explanation: string;
  }[];
  keyRisks: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  safety_score: number;
  advice: string;
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

export async function analyzeIngredients(input: string, isImage: boolean = false, mimeType?: string): Promise<IngredientAnalysis> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Please configure it in the Secrets panel.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  
  const prompt = `You are a health, food, and cosmetic ingredient safety expert.
  Analyze the following product ingredients and provide:
  1. Ingredient name
  2. Risk level (Low / Medium / High)
  3. Possible side effects
  4. Short and simple explanation (easy to understand)
  Also provide:
  5. Key Risks Identified: A summary of the most significant risks found across all ingredients.
  6. Overall safety score (0 to 100)
  7. General advice for using this product
  
  Return the response strictly in this JSON format:
  {
    "ingredients": [
      {
        "name": "",
        "risk": "",
        "side_effects": "",
        "explanation": ""
      }
    ],
    "keyRisks": [
      {
        "title": "",
        "description": "",
        "severity": ""
      }
    ],
    "safety_score": 0,
    "advice": ""
  }
  Keep the language simple and clear.`;

  let contents: any;
  if (isImage && input && mimeType) {
    contents = {
      parts: [
        { inlineData: { data: input, mimeType: mimeType } },
        { text: prompt }
      ]
    };
  } else {
    contents = `${prompt}\n\nIngredients: ${input}`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                risk: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                side_effects: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["name", "risk", "side_effects", "explanation"]
            }
          },
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
          safety_score: { type: Type.INTEGER },
          advice: { type: Type.STRING }
        },
        required: ["ingredients", "keyRisks", "safety_score", "advice"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Failed to get a response from the AI.");
  }

  try {
    return JSON.parse(resultText) as IngredientAnalysis;
  } catch (e) {
    console.error("Failed to parse AI response:", resultText);
    throw new Error("Failed to parse the analysis result.");
  }
}

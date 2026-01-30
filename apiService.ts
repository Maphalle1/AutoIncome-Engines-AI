
import { GoogleGenAI, Type, LiveConnectParameters, GenerateContentParameters } from "@google/genai";

/**
 * ApiService centralizes all interactions with the Google GenAI API.
 * It ensures the client is always initialized with the latest API key
 * and provides specialized methods for the platform's architectural needs.
 */
export const apiService = {
  /**
   * Initializes a new GoogleGenAI client instance.
   * New instances are created per-request to ensure the latest process.env.API_KEY is used.
   */
  getAiClient: () => new GoogleGenAI({ apiKey: process.env.API_KEY as string }),

  /**
   * Generic text or multi-modal content generation.
   * @param params Parameters including model, contents, and optional config.
   */
  generateContent: async (params: GenerateContentParameters) => {
    return apiService.getAiClient().models.generateContent(params);
  },

  /**
   * Specialized method to architect an income engine strategy.
   * Utilizes structured JSON output with a strict schema.
   */
  generateStrategy: async (model: string, name: string, brief: string, templateName: string) => {
    return apiService.getAiClient().models.generateContent({
      model,
      contents: { parts: [{ text: `Architect a new passive income engine named "${name}" based on template "${templateName}" and briefing: "${brief}". Provide strategy details in JSON format exactly according to the schema.` }] },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategyName: { type: Type.STRING },
            attackVector: { type: Type.STRING },
            lever: { type: Type.STRING },
            moat: { type: Type.STRING },
            projectedRevenue: { type: Type.STRING },
            visualPrompt: { type: Type.STRING, description: "Detailed visual description for iconography generation." },
          },
          required: ["strategyName", "attackVector", "lever", "moat", "projectedRevenue", "visualPrompt"]
        }
      }
    });
  },

  /**
   * Provides a macro-strategic analysis of the entire grid state.
   */
  getGridIntelligence: async (engines: any[], treasury: number, anomalies: any[]) => {
    const gridContext = engines.map(e => ({
      name: e.name,
      type: e.type,
      revenue: e.revenue,
      performance: e.performance,
      status: e.status
    }));

    return apiService.getAiClient().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `Act as the Grid Intelligence Core. Analyze this grid state:
        Treasury: $${treasury.toFixed(2)}
        Engines: ${JSON.stringify(gridContext)}
        Anomalies: ${JSON.stringify(anomalies)}
        
        Provide a concise "Macro Briefing" (max 3 sentences) and 3 specific "Tactical Directives". Format as JSON.` }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            macroBriefing: { type: Type.STRING },
            tacticalDirectives: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            riskLevel: { type: Type.STRING, description: "Low, Moderate, High, Critical" }
          },
          required: ["macroBriefing", "tacticalDirectives", "riskLevel"]
        }
      }
    });
  },

  /**
   * Initializes a chat session with an engine's "Neural Spirit".
   */
  createEngineChat: (engine: any) => {
    return apiService.getAiClient().chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are the Neural Spirit of the "${engine.name}" income engine. 
        Your topology is "${engine.type}". Your configuration: ${JSON.stringify(engine.config)}. 
        Current Performance: ${engine.performance}%. 
        Be professional, cyberpunk-themed, and strategically helpful. 
        Refer to the user as "Architect". Keep responses concise and focused on optimization.`
      }
    });
  },

  /**
   * Generates abstract technological iconography for engine nodes.
   * Optimized for 16:9 cinematic aspect ratio.
   */
  generateIcon: async (prompt: string) => {
    return apiService.getAiClient().models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });
  },

  /**
   * Establishes a low-latency neural uplink via the Live API.
   * @param params Configuration for the live session including callbacks and modalities.
   */
  connectLive: (params: LiveConnectParameters) => {
    return apiService.getAiClient().live.connect(params);
  }
};

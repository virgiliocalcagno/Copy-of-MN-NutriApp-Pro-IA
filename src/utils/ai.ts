import { GoogleGenerativeAI } from "@google/generative-ai";
import { Profile } from "../types/store";

export interface AIResponse {
  perfilAuto: Partial<Profile>;
  semana: Record<string, Record<string, string>>;
  ejercicios: Record<string, any[]>;
  compras: [string, string, number, string, string][];
}

export const processPdfWithGemini = async (
  perfil: Partial<Profile>,
  pdfPlanBase64?: string,
  pdfEvalBase64?: string,
  apiKey?: string // Kept for interface compatibility but optional now
): Promise<AIResponse> => {
  try {
    // We now use the Cloud Function endpoint for reliability
    const FUNCTION_URL = 'https://procesarnutricion-us-central1-mn-nutriapp.cloudfunctions.net/procesarNutricion';

    // Preparation: Remove data URL prefix if present
    const cleanPlan = pdfPlanBase64?.replace(/^data:application\/pdf;base64,/, "");
    const cleanEval = pdfEvalBase64?.replace(/^data:application\/pdf;base64,/, "");

    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        perfil: JSON.stringify(perfil),
        pdfPlan: cleanPlan,
        pdfEval: cleanEval
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP Error ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error: any) {
    console.error("AI Analysis Error (Cloud Function):", error);
    throw error;
  }
};

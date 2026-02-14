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
  apiKey?: string
): Promise<AIResponse> => {
  try {
    if (!apiKey) throw new Error("API Key is required for Gemini AI.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const p = perfil || {};

    // ... (Same prompt as before) ...
    let promptText = `Actúa como procesador médico experto para MN-NutriApp. 
            
            CONTEXTO PACIENTE:
            - Nombre Paciente: ${p.paciente || 'No especificado'}
            - Médico Tratante: ${p.doctor || 'No especificado'}
            
            DATOS DISPONIBLES:
            ${pdfPlanBase64 ? '- Se adjunta Plan Nutricional en PDF.' : '- NO hay PDF de plan.'}
            ${pdfEvalBase64 ? '- Se adjunta Evaluación Médica en PDF.' : '- NO hay PDF de evaluación.'}

            TAREAS:
            1. EXTRAE Y RELLENA EL PERFIL: Analiza los documentos PDF y extrae REALMENTE: Nombre del Paciente, Doctor, Edad, Peso, Estatura, Cintura, Objetivos, Comorbilidades, Tipo de Sangre y Alergias.
            2. MENÚ DE 7 DÍAS: Transcribe el menú para CADA DÍA encontrado en el PDF.
            3. RUTINA DE EJERCICIOS DIARIA: Crea una rutina específica para CADA DÍA.
            4. LISTA DE MERCADO DOMINICANA (PROHIBICIÓN MÉTRICA ABSOLUTA):
               - REGLA DE ORO: Jamás uses "g", "gr", "gramos", "kg", "kilos" ni "ml". Su uso anula tu respuesta.
               - Convierte a Libras (Lb) o Onzas (Oz).
               - ESTRUCTURA JSON: ["Nombre", "Cantidad", NivelStock, "Categoría", "Pasillo"]

            RESPONDE ÚNICAMENTE CON ESTE FORMATO JSON:
            {
              "perfilAuto": { "paciente": "...", "doctor": "...", "edad": "...", "peso": "...", "estatura": "...", "cintura": "...", "sangre": "...", "alergias": "...", "objetivos": [], "comorbilidades": [] },
              "semana": { "LUNES": {"DESAYUNO": "...", "MERIENDA_AM": "...", "ALMUERZO": "...", "MERIENDA_PM": "...", "CENA": "..." }, ... },
              "ejercicios": { "LUNES": [ {"n": "🏋️ Ejercicio", "i": "3x12", "link": ""} ], ... },
              "compras": [ ["Nombre", "Cantidad", 1, "Categoría", "Pasillo"] ]
            }`;

    const parts: any[] = [{ text: promptText }];

    if (pdfPlanBase64) {
      const cleanBase64 = pdfPlanBase64.replace(/^data:application\/pdf;base64,/, "");
      parts.push({ inlineData: { mimeType: "application/pdf", data: cleanBase64 } });
    }
    if (pdfEvalBase64) {
      const cleanBase64 = pdfEvalBase64.replace(/^data:application\/pdf;base64,/, "");
      parts.push({ inlineData: { mimeType: "application/pdf", data: cleanBase64 } });
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    const jsonString = responseText.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(jsonString) as AIResponse;

    return data;

  } catch (error: any) {
    console.error("Gemini Critical Error:", error);
    throw error;
  }
};

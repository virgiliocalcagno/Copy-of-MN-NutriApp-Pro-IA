const { onRequest } = require("firebase-functions/v2/https");
const { VertexAI } = require('@google-cloud/vertexai');
const admin = require('firebase-admin');

admin.initializeApp();

exports.procesarNutricion = onRequest({
  cors: true, timeoutSeconds: 120, region: "us-central1"
}, async (req, res) => {
  try {
    const vertexAI = new VertexAI({ project: 'mn-nutriapp', location: 'us-central1' });
    const modelIA = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const { perfil, pdfPlan, pdfEval } = req.body;
    const p = perfil ? JSON.parse(perfil) : {};

    let promptParts = [{
      text: `Actúa como procesador médico experto para MN-NutriApp. 
            
            CONTEXTO PACIENTE:
            - Nombre Paciente: ${p.patientName || 'Virgilio Augusto'}
            - Médico Tratante: ${p.doctorName || 'Especialista Nutricional'}
            - Edad: ${p.age || 52} años
            - Peso: ${p.weight || 177} lbs
            - Cintura: ${p.waist || '--'} cm
            - Estatura: ${p.height || '5\'10"'}
            - Objetivo: ${p.goal || 'Control de peso'}
            - Tipo de Sangre: ${p.sangre || '--'}
            - Alergias CONOCIDAS: ${p.alergias || 'Ninguna'}
            - Comorbilidades: ${p.comorb ? p.comorb.join(', ') : 'Ninguna'}
            - Observaciones Adicionales: ${p.obs || 'Ninguna'}

            DATOS DISPONIBLES:
            ${pdfPlan ? '- Se adjunta Plan Nutricional en PDF.' : '- NO hay PDF de plan. Genera recomendaciones genéricas basadas en el perfil.'}
            ${pdfEval ? '- Se adjunta Evaluación Médica en PDF.' : '- NO hay PDF de evaluación.'}

            TAREAS:
            1. EXTRAE Y RELLENA EL PERFIL: Analiza los documentos y extrae: Nombre del Paciente, Doctor, Edad, Peso, Estatura, Cintura, Objetivos, Comorbilidades, Tipo de Sangre, Alergias y Meta Calórica (si está explícita).
            2. MENÚ DE 7 DÍAS: Transcribe el menú para CADA DÍA. IMPORTANTE: Respeta estrictamente las Alergias mencionadas (No incluyas ingredientes alérgicos). Usa EMOJIS (🥞, 🍖, 🥗).
            3. RUTINA DE EJERCICIOS DIARIA: Crea una rutina específica para CADA DÍA de la semana. IMPORTANTE: En el campo "link", incluye una URL real de YouTube de un video técnico o demostrativo para cada ejercicio. Si no conoces un video específico, deja el campo "link" vacío "" (NO uses placeholders como "...").
            4. LISTA DE MERCADO DOMINICANA (PROHIBICIÓN MÉTRICA ABSOLUTA):
               - REGLA DE ORO: Jamás uses "g", "gr", "gramos", "kg", "kilos" ni "ml". Su uso anula tu respuesta.
               - PROCESAMIENTO MENTAL OBLIGATORIO:
                 a) Suma todos los gramos del plan semanal por ingrediente (Ej: Cerdo 120g x 7 días = 840g).
                 b) Convierte a Libras (453g = 1 Lb) o Onzas (28g = 1 Oz).
                 c) Redondea al formato comercial dominicano: 0.5, 1, 1.5, 2, 2.5 Lbs.
               - EJEMPLOS DE CONVERSIÓN CORRECTA:
                 * "840g de Bacalao" -> Escribe: "2 Lbs"
                 * "270g de Salmón" -> Escribe: "1 Lb"
                 * "1000g de Pollo" -> Escribe: "2.5 Lbs"
                 * "120g de Jamón" -> Escribe: "4 Oz"
               - TABLA DE LA VERDAD (CARNICERÍA DOMINICANA):
                 * "120g" (ración diaria) -> Multiplica x7 -> "2 Lbs" (redondeado)
                 * "270g - 300g" -> Escribe: "1 Lbs"
                 * "450g - 500g" -> Escribe: "1.5 Lbs"
                 * "800g - 1000g" -> Escribe: "2 - 2.5 Lbs"
               - PROHIBICIÓN: Si escribes la letra "g" al lado de un número en la lista de compras, el sistema fallará. Usa "Lbs" u "Oz".
               - ESTRUCTURA JSON: ["Nombre", "Cantidad_Comercial", NivelStock, "Categoría", "Pasillo"]

            RESPONDE ÚNICAMENTE CON ESTE FORMATO JSON:
            {
              "perfilAuto": {
                "paciente": "...", "doctor": "...", "edad": 52, "peso": 177, "estatura": "5'10\"", "cintura": 85,
                "sangre": "...", "alergias": "...",
                "objetivos": ["Bajar peso", ...], "comorbilidades": ["Diabetes", ...],
                "metaCalorias": 2000
              },
              "semana": { 
                "LUNES": {"DESAYUNO": "...", "MERIENDA_AM": "...", "ALMUERZO": "...", "MERIENDA_PM": "...", "CENA": "..." },
                ... (todos los días con EMOJIS)
              },
              "ejercicios": {
                "LUNES": [ {"n": "🏋️ Ejercicio", "i": "3x12", "link": ""} ],
                ... (todos los días)
              },
              "compras": [ ["Nombre", "Cantidad Comercial (Lbs/Oz)", 1, "Categoría", "Pasillo"] ]
            }`
    }];

    if (pdfPlan) promptParts.push({ inlineData: { mimeType: "application/pdf", data: pdfPlan } });
    if (pdfEval) promptParts.push({ inlineData: { mimeType: "application/pdf", data: pdfEval } });

    const result = await modelIA.generateContent({ contents: [{ role: 'user', parts: promptParts }] });
    const text = result.response.candidates[0].content.parts[0].text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).send({ error: "La IA no generó JSON", raw: text });

    const data = JSON.parse(jsonMatch[0]);
    res.status(200).send(data);

  } catch (e) {
    console.error("Global Error:", e);
    res.status(500).send({ error: e.message });
  }
});

exports.analizarComida = onRequest({
  cors: true, timeoutSeconds: 60, region: "us-central1"
}, async (req, res) => {
  try {
    const vertexAI = new VertexAI({ project: 'mn-nutriapp', location: 'us-central1' });
    const modelIA = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const { imagenBase64, perfilPaciente } = req.body;
    const p = perfilPaciente || {};

    // Prompt Experto para Bio-Hacks y Análisis
    const prompt = `Analiza esta imagen de comida como un Coach Metabólico experto.
        
        PERFIL PACIENTE:
        - Meta: ${p.objetivo || 'Salud General'}
        - Patologías/Alergias: ${p.condiciones || 'Ninguna'}
        
        TU MISIÓN:
        1. Identificar alimentos y estimar calorías totales (sé realista).
        2. SEMÁFORO METABÓLICO: 
           - VERDE (Balanceado), AMARILLO (Precaución), ROJO (Exceso/Desbalance).
        3. BIO-HACK (Consejo de Experto):
           - No solo digas "es malo". Da una ESTRATEGIA para mitigar el impacto (ej: "Come fibra antes", "Camina después", "Añade proteína").
        
        RESPONDE SOLO JSON:
        {
            "platos": ["Nombre Plato", ...],
            "totalCalorias": 0,
            "semaforo": "VERDE" | "AMARILLO" | "ROJO",
            "macros": { "p": "0g", "c": "0g", "f": "0g" },
            "analisis": "Breve explicación del semáforo...",
            "bioHack": "Tu consejo experto y accionable aquí."
        }`;

    const parts = [
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: imagenBase64 } }
    ];

    const result = await modelIA.generateContent({ contents: [{ role: 'user', parts }] });
    const text = result.response.candidates[0].content.parts[0].text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).send({ error: "Error analizando imagen", raw: text });

    res.status(200).send(JSON.parse(jsonMatch[0]));

  } catch (e) {
    console.error("Error NutriScan:", e);
    res.status(500).send({ error: e.message });
  }
});


exports.testIA = onRequest({
  cors: true, region: "us-central1"
}, async (req, res) => {
  const vertexAI = new VertexAI({ project: 'mn-nutriapp', location: 'us-central1' });
  try {
    const modelIA = vertexAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await modelIA.generateContent({ contents: [{ role: 'user', parts: [{ text: 'hola' }] }] });
    res.status(200).send({ status: "OK", response: result.response.candidates[0].content.parts[0].text });
  } catch (e) {
    res.status(500).send({ status: "FAIL", error: e.message });
  }
});
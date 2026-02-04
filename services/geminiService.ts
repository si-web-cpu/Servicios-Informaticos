
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    console.error("Falta API_KEY");
    return "Error: No se detectó la API_KEY en el entorno de Netlify. Por favor, configúrala en el panel de control del sitio.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    // Usamos gemini-3-flash-preview como recomendado
    const modelName = 'gemini-3-flash-preview';
    
    const systemInstruction = `
      Eres el asistente de 'Servicios Informáticos'. 
      Brindamos soporte técnico para Windows y Linux en Hogares y Pequeños Negocios.
      IMPORTANTE: No reparamos Apple/Mac.
      Responde de forma concisa y profesional. Si preguntan por precios, di que dependen del caso y que usen el formulario de contacto.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "No recibí una respuesta clara del modelo.";
  } catch (error: any) {
    console.error("Error Detallado de Gemini:", error);
    
    const msg = error.message?.toLowerCase() || "";
    
    if (msg.includes('403') || msg.includes('permission')) {
      return "Error de Permisos (403): La clave de API es válida pero tiene restricciones de dominio en Google Cloud, o la API de IA Generativa no está habilitada en tu proyecto.";
    }
    
    if (msg.includes('401') || msg.includes('api key not found')) {
      return "Error de Clave (401): La clave de API configurada es inválida o expiró.";
    }

    if (msg.includes('user location') || msg.includes('supported region')) {
      return "Error de Región: El modelo Gemini 3 no está disponible en tu ubicación geográfica actual.";
    }
    
    return "El servicio de IA encontró un error técnico. Por favor, utiliza el formulario de contacto para comunicarte con nosotros.";
  }
};

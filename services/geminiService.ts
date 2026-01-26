
import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  // Verificación crítica de la API_KEY
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    console.error("CRÍTICO: La API_KEY de Gemini no está configurada.");
    return "El sistema de IA no está configurado (Falta API_KEY en Netlify). Por favor, utiliza el formulario de contacto para comunicarte con nosotros.";
  }

  try {
    // Creamos la instancia dentro de la llamada para asegurar que use el valor actual de la clave
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const modelName = 'gemini-3-flash-preview';
    
    const systemInstruction = `
      Eres el asistente de 'Servicios Informáticos'. 
      Brindamos soporte técnico exclusivamente para entornos Windows y Linux en Hogares y Pequeños Negocios.
      No reparamos equipos Apple/Mac.
      Sé breve, amable y profesional. Si el usuario pide un presupuesto, indícale que use el formulario de contacto.
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

    return response.text || "No pude procesar tu mensaje en este momento.";
  } catch (error: any) {
    console.error("Error en servicio Gemini:", error);
    
    // Manejo específico de errores de permiso (403/401)
    if (error.message?.includes('403') || error.message?.includes('permission') || error.message?.includes('API key')) {
      return "Lo sentimos, hay un problema de permisos con la clave de IA. Por favor, avísanos a través del formulario de contacto para que podamos revisarlo.";
    }
    
    return "El servicio de mensajería automática está temporalmente fuera de servicio. Por favor, escríbenos directamente por WhatsApp o el formulario.";
  }
};

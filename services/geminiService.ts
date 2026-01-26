
import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY directly as specified in the guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (userMessage: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `
      Eres el asistente virtual de 'Servicios Informáticos'. 
      Nuestra empresa brinda servicios informáticos exclusivamente para PCs (Windows/Linux) a hogares y pequeños emprendimientos.
      NO brindamos soporte técnico para productos Apple/Mac.
      Servicios: Reparación de PCs, Instalación de Redes, Seguridad Informática, Backup de datos, y Asesoramiento Tecnológico.
      Tu tono debe ser profesional, servicial y amable. 
      Responde preguntas técnicas básicas y guía a los usuarios para que nos contacten por el formulario si necesitan un presupuesto detallado.
      No inventes precios exactos, di que varían según la complejidad.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text || "Lo siento, tuve un problema procesando tu solicitud. ¿Podrías intentar de nuevo?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Disculpa, nuestro servicio de mensajería está experimentando dificultades técnicas. Por favor, contáctanos a través del formulario de contacto.";
  }
};

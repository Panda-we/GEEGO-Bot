const { GoogleGenAI } = require("@google/genai")
// ✅ Import the Google Generative AI SDK

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
// ✅ Initialize the Gemini client using your API key from .env
const ai = new GoogleGenAI({});


/**
 * Generate a text response using the Gemini model
 * @param {string} content - The user's input or prompt
 * @returns {Promise<string>} - The AI-generated text response
 */
async function generateResponse(content) {

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: content }] }],//content=prompt which is type in frontend like questions to ai
      config: {
        temperature: 0.7,
        // systemInstruction :
      }
    });

    const text = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    return text;
  } catch (error) {
    console.error("❌ AI response error:", error);
    return "Sorry, I couldn’t generate a response.";
  }


}

/**
 * Generate an embedding (vector representation) for a given text
 * @param {string} content - The text to embed
 * @returns {Promise<number[]>} - The 768-dimensional embedding vector
 */
async function generateVector(content) {
  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: [{ role: "user", parts: [{ text: content }] }],
      config: { outputDimensionality: 768 }
    });
    return response.embedding.values;

  } catch (error) {
    console.error("❌ Vector generation error:", error);
    return [];
  }
}

module.exports = {
  generateResponse,
  generateVector
}

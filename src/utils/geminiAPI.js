import axios from 'axios';

/**
 * Analyzes a prescription image using Google Gemini AI
 * @param {File} imageFile - The prescription image file
 * @returns {Promise<Object>} - The analysis results
 */
export const analyzePrescriptionWithGemini = async (imageFile) => {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);

    // API key for Gemini
    const API_KEY = "AIzaSyC7Um7MQoGoJHK_wGJqQECwOJzFxxMU5";
    const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
    
    // Prepare API request
    const requestData = {
      contents: [{
        parts: [
          { text: "Analyze this medical prescription image. Extract and provide the following information in JSON format:\n" +
                 "1. Medications with dosage, frequency, and instructions\n" +
                 "2. Doctor's name\n" +
                 "3. Date of prescription\n" +
                 "4. Number of refills\n" +
                 "Return the data in the following format:\n" +
                 "{\n" +
                 "  \"medications\": [\n" +
                 "    {\n" +
                 "      \"name\": \"Medication name\",\n" +
                 "      \"dosage\": \"Amount and unit\",\n" +
                 "      \"frequency\": \"How often to take it\",\n" +
                 "      \"duration\": \"For how long\",\n" +
                 "      \"instructions\": \"Special instructions\"\n" +
                 "    }\n" +
                 "  ],\n" +
                 "  \"doctor\": \"Doctor's name\",\n" +
                 "  \"date\": \"YYYY-MM-DD\",\n" +
                 "  \"refills\": Number\n" +
                 "}" },
          { inlineData: { mimeType: imageFile.type, data: base64Image.split(',')[1] } }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    // Make API call to Gemini
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Process response and extract JSON object from text
    let analysisResult = extractJsonFromText(response.data.candidates[0].content.parts[0].text);
    
    // If parsing fails, provide fallback data
    if (!analysisResult) {
      analysisResult = createFallbackAnalysis();
    }
    
    return analysisResult;
  } catch (error) {
    console.error("Error analyzing prescription with Gemini:", error);
    throw new Error("Failed to analyze the prescription. Please try again.");
  }
};

/**
 * Extract JSON from text response
 * @param {string} text - The text containing JSON
 * @returns {Object|null} - Parsed JSON or null if parsing fails
 */
const extractJsonFromText = (text) => {
  try {
    // Try to find JSON-like structure in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error("Error parsing JSON from Gemini response:", error);
    return null;
  }
};

/**
 * Create fallback analysis in case of failure
 * @returns {Object} - Fallback analysis data
 */
const createFallbackAnalysis = () => {
  return {
    medications: [
      {
        name: "Unable to fully interpret prescription",
        dosage: "Please verify with your doctor",
        frequency: "As directed",
        duration: "As prescribed",
        instructions: "Please consult with your healthcare provider to confirm details"
      }
    ],
    doctor: "Unknown (Please verify)",
    date: new Date().toISOString().split('T')[0],
    refills: 0
  };
};

/**
 * Convert file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

import { GoogleGenerativeAI } from "@google/generative-ai";

function getModel() {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing. Add REACT_APP_GEMINI_API_KEY to your environment.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

export async function callGeminiRaw(prompt) {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

function stripCodeFences(text) {
  return String(text || "")
    .replace(/^\uFEFF/, "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function extractBalancedJSON(text) {
  const source = stripCodeFences(text);
  const start = [...source].findIndex((char) => char === "{" || char === "[");

  if (start === -1) return source;

  const opener = source[start];
  const closer = opener === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < source.length; i += 1) {
    const char = source[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === opener) depth += 1;
    if (char === closer) depth -= 1;

    if (depth === 0) {
      return source.slice(start, i + 1);
    }
  }

  return source.slice(start);
}

function parseGeminiJSON(text) {
  const jsonText = extractBalancedJSON(text)
    .replace(/,\s*([}\]])/g, "$1")
    .trim();

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    error.message = `The AI returned text that was not valid JSON. ${error.message}`;
    error.rawResponse = text;
    throw error;
  }
}

export async function callGeminiJSON(prompt) {
  const model = getModel();
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${prompt}\n\nReturn only machine-readable JSON. Do not include markdown, explanations, or code fences.`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  return parseGeminiJSON(result.response.text());
}

export async function callGeminiForResume(prompt) {
  return callGeminiJSON(prompt);
}

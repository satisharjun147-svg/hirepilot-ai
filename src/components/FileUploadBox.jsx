import { useRef, useState } from "react";
import { ErrBox, StatusMessage } from "./ToolPrimitives";
import * as pdfjsLib from "pdfjs-dist";

// This tells PDF.js to ignore local bundling and pull directly from the CDN.
// This prevents Vercel from trying to resolve the missing .mjs file during build.
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}
const MAX_FILE_SIZE_MB = 12;

function cleanExtractedText(text) {
  return String(text || "")
    .split("\u0000")
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export async function extractTextFromFile(file) {
  if (!file) {
    return { text: "", error: "No file provided." };
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { text: "", error: `Please upload a file smaller than ${MAX_FILE_SIZE_MB} MB.` };
  }

  const lower = file.name.toLowerCase();

  try {
    if (lower.endsWith(".pdf")) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib
        .getDocument({
          data: arrayBuffer,
          disableWorker: true,
          useWorkerFetch: false,
          isEvalSupported: false,
        })
        .promise;

      let text = "";
      let ocrText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent({ disableCombineTextItems: false });
          const pageText = (textContent?.items || [])
            .map((item) => item?.str || "")
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();

          if (pageText) {
            text += `${pageText}\n`;
          }

          if (typeof window !== "undefined" && typeof document !== "undefined") {
            const viewport = page.getViewport({ scale: 2.2 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext("2d");

            if (context) {
              await page.render({ canvasContext: context, viewport }).promise;
              const { createWorker } = await import("tesseract.js");
              const worker = await createWorker("eng");

              try {
                const { data } = await worker.recognize(canvas);
                const pageOcrText = cleanExtractedText(data?.text || "");
                if (pageOcrText) {
                  ocrText += `${pageOcrText}\n`;
                }
              } catch (ocrErr) {
                console.warn("OCR fallback failed for a PDF page:", ocrErr);
              } finally {
                await worker.terminate();
              }
            }
          }
        } catch (pageErr) {
          console.warn(`PDF page ${pageNum} failed to parse:`, pageErr);
        }
      }

      const extractedText = cleanExtractedText(text);
      const fallbackText = cleanExtractedText(ocrText || extractedText);

      if (fallbackText) {
        return { text: fallbackText, error: "" };
      }

      return {
        text: "",
        error: "We could not extract readable text from this PDF. Please upload a text-based PDF or a clearer scan.",
      };
    }

    if (lower.endsWith(".docx")) {
      const mammoth = await import("mammoth/mammoth.browser");
      const buf = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: buf });
      return { text: cleanExtractedText(result.value), error: "" };
    }

    if (lower.endsWith(".txt")) {
      let text = "";

      if (typeof file.text === "function") {
        text = await file.text();
      } else if (typeof FileReader !== "undefined") {
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ""));
          reader.onerror = () => reject(reader.error || new Error("Could not read file."));
          reader.readAsText(file);
        });
      }

      return { text: cleanExtractedText(text), error: "" };
    }

    return { text: "", error: "Unsupported file type. Please upload PDF, DOCX, or TXT." };
  } catch (err) {
    console.error("FILE READ ERROR:", err);
    return {
      text: "",
      error: "We could not read this file. Try exporting it as a text-based PDF, DOCX, or TXT file.",
    };
  }
}

export default function FileUploadBox({ onTextExtracted }) {
  const [fileName, setFileName] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    setExtractError("");
    setStatusMessage("");
    setProgressMessage("Preparing your file...");
    setFileName(file.name);

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setExtractError(`Please upload a file smaller than ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setExtracting(true);

    try {
      const lower = file.name.toLowerCase();
      if (lower.endsWith(".pdf")) {
        setProgressMessage("Reading PDF text...");
      } else if (lower.endsWith(".docx")) {
        setProgressMessage("Extracting document text...");
      } else if (lower.endsWith(".txt")) {
        setProgressMessage("Reading text file...");
      }

      const { text, error } = await extractTextFromFile(file);

      if (error) {
        setExtractError(error);
        setProgressMessage("");
      } else if (!text) {
        setExtractError(
          "This file looks scanned or image-based, so text could not be read. Please paste the resume text manually or upload a clearer scan."
        );
        setProgressMessage("");
      } else {
        onTextExtracted(text);
        setStatusMessage("Resume text loaded successfully.");
        setProgressMessage("");
      }
    } catch (err) {
      console.error("FILE READ ERROR:", err);
      setExtractError("We could not read this file. Try exporting it as a text-based PDF, DOCX, or TXT file.");
    }

    setExtracting(false);
    setProgressMessage("");
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          border: "2px dashed #2a4c75",
          borderRadius: 10,
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          background: "rgba(255,255,255,0.025)",
          marginBottom: 10,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <div style={{ fontSize: 12, fontWeight: 800, color: "#7dd3fc", marginBottom: 6, textTransform: "uppercase" }}>
          Upload
        </div>

        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#f1f5f9" }}>
          {fileName ? fileName : "Drop PDF, DOCX, or TXT here"}
        </div>

        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 3 }}>
          Text-based files work best
        </div>
      </div>

      {extracting && (
        <div style={{ textAlign: "center", padding: "10px 0", color: "#cbd5e1" }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{progressMessage || "Reading your file..."}</div>
          <div style={{ fontSize: 12, color: "#64748b" }}>This may take a moment for larger or scanned documents.</div>
        </div>
      )}

      {statusMessage && <StatusMessage type="success" text={statusMessage} />}
      {extractError && <ErrBox msg={extractError} />}
    </div>
  );
}
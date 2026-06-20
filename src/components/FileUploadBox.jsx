import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth/mammoth.browser";
import { ErrBox } from "./ToolPrimitives";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export default function FileUploadBox({ onTextExtracted }) {
  const [fileName, setFileName] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const fileInputRef = useRef(null);

  const extractFromPDF = async (file) => {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((it) => it.str).join(" ") + "\n";
    }
    return text;
  };

  const extractFromDOCX = async (file) => {
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buf });
    return result.value;
  };

  const handleFile = async (file) => {
    if (!file) return;
    setExtractError("");
    setFileName(file.name);
    setExtracting(true);
    try {
      let text = "";
      const lower = file.name.toLowerCase();
      if (lower.endsWith(".pdf")) text = await extractFromPDF(file);
      else if (lower.endsWith(".docx")) text = await extractFromDOCX(file);
      else if (lower.endsWith(".txt")) text = await file.text();
      else {
        setExtractError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
        setExtracting(false);
        return;
      }

      if (!text.trim()) setExtractError("Couldn't find readable text in this file — it may be a scanned image. Try pasting your resume text instead.");
      else onTextExtracted(text.trim());
    } catch (err) {
      setExtractError("Couldn't read this file. Try a different file, or paste your resume text below instead.");
    }
    setExtracting(false);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }} style={{ border: "2px dashed #1e3a5f", borderRadius: 10, padding: "20px", textAlign: "center", cursor: "pointer", background: "rgba(255,255,255,0.02)", marginBottom: 10 }}>
        <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
        <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#f1f5f9" }}>{fileName ? fileName : "Upload PDF, DOCX, or TXT"}</div>
        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>or paste text in the box below</div>
      </div>
      {extracting && <div style={{ textAlign: "center", padding: "10px 0", color: "#64748b", fontSize: 13 }}><div style={{ width: 20, height: 20, border: "2px solid #1e3a5f", borderTop: "2px solid #3b82f6", borderRadius: "50%", margin: "0 auto 8px", animation: "spin 1s linear infinite" }} />Reading your file...<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>}
      {extractError && <ErrBox msg={extractError} />}
    </div>
  );
}
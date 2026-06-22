import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth/mammoth.browser";
import { ErrBox } from "./ToolPrimitives";

// ✅ FIX: Changed .js to .mjs at the end of the URL to match modern pdfjs-dist versions
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;

export default function FileUploadBox({ onTextExtracted }) {
  const [fileName, setFileName] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const fileInputRef = useRef(null);

  const extractFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer
    }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ");

      text += pageText + "\n";
    }

    return text;
  };

  const extractFromDOCX = async (file) => {
    const buf = await file.arrayBuffer();
    const result = await mammoth.extractRawText({
      arrayBuffer: buf
    });

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

      if (lower.endsWith(".pdf")) {
        text = await extractFromPDF(file);
      } else if (lower.endsWith(".docx")) {
        text = await extractFromDOCX(file);
      } else if (lower.endsWith(".txt")) {
        text = await file.text();
      } else {
        setExtractError(
          "Unsupported file type. Please upload PDF, DOCX, or TXT."
        );
        setExtracting(false);
        return;
      }

      if (!text || !text.trim()) {
        setExtractError(
          "This PDF appears to be image/scanned based. Please paste resume text manually."
        );
      } else {
        onTextExtracted(text.trim());
      }
    } catch (err) {
      console.error("PDF ERROR:", err);
      setExtractError(`Couldn't read file: ${err.message}`);
    }

    setExtracting(false);
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
          border: "2px dashed #1e3a5f",
          borderRadius: 10,
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          background: "rgba(255,255,255,0.02)",
          marginBottom: 10
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <div style={{ fontSize: 24, marginBottom: 6 }}>
          📎
        </div>

        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: "#f1f5f9"
          }}
        >
          {fileName ? fileName : "Upload PDF, DOCX, or TXT"}
        </div>

        <div
          style={{
            fontSize: 11.5,
            color: "#64748b",
            marginTop: 2
          }}
        >
          or paste text in the box below
        </div>
      </div>

      {extracting && (
        <div
          style={{
            textAlign: "center",
            padding: "10px 0",
            color: "#64748b"
          }}
        >
          Reading your file...
        </div>
      )}

      {extractError && <ErrBox msg={extractError} />}
    </div>
  );
}
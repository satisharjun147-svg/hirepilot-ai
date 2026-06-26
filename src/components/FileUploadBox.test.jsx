import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUploadBox, { extractTextFromFile } from "./FileUploadBox";

describe("FileUploadBox", () => {
  it("shows a helpful error for unsupported files", async () => {
    render(<FileUploadBox onTextExtracted={() => {}} />);

    const input = document.querySelector('input[type="file"]');
    const file = new File(["hello"], "resume.csv", { type: "text/csv" });

    Object.defineProperty(input, "files", { value: [file] });
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
    });
  });

  it("reads plain text resumes without a parser error", async () => {
    const file = new File(["Jane Doe\nSenior Engineer"], "resume.txt", { type: "text/plain" });
    const result = await extractTextFromFile(file);

    expect(result.text).toContain("Jane Doe");
    expect(result.error).toBe("");
  });
});

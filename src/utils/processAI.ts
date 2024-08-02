// processAI.ts

export const handleProcessAI = async (
  file: File | null,
  setIsProcessing: (isProcessing: boolean) => void,
  setResult: (result: string | null) => void
) => {
  if (file) {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/process-gemini", {
        method: "POST",
        body: formData,
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`
        );
      }
      const data = JSON.parse(text);
      setResult(data.result);
    } catch (error) {
      console.error("Error processing file with Gemini AI:", error);
      alert("An error occurred while processing the file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }
};

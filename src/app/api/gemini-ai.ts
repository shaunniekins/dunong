// app/api/gemini-ai.ts

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  Part,
} from "@google/generative-ai";

import { GoogleAIFileManager } from "@google/generative-ai/server";

const apiKey: string | undefined = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(path: string, mimeType: string) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

async function waitForFilesActive(files: any[]) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name);
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function run(file: File): Promise<string> {
  try {
    // Convert File to binary data
    const buffer = await file.arrayBuffer();
    const binaryData = new Uint8Array(buffer);

    // Create a Part object for the file
    const filePart: Part = {
      inlineData: {
        data: Buffer.from(binaryData).toString("base64"),
        mimeType: file.type,
      },
    };

    const prompt =
      "Extract key concepts from the provided document and generate flashcards in a JSON format. Each flashcard should contain a question or term and its corresponding answer or definition. Use the following structure for each flashcard: {question: '...', answer: '...'}. Aim for comprehensive coverage of the document's content. Ensure ALL key topics and subtopics are covered in the flashcards.";

    const result = await model.generateContent([prompt, filePart]);

    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error in run function:", error);
    throw error;
  }
}

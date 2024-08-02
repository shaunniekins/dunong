"use client";

import { handleProcessAI } from "@/utils/processAI";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Key, useEffect, useRef, useState } from "react";
import { GoFile, GoImage } from "react-icons/go";
import { IoReload } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useFlashcardStore } from "@/app/flashcard-generator/flashcardStore";

interface CardDisplay {
  question: string;
  answer: string;
}

const AddNewComponent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState("document");

  const router = useRouter();
  const setCards = useFlashcardStore((state) => state.setCards);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (file: File) => {
    const validDocumentTypes = [
      "application/pdf",
      "application/epub+zip",
      "application/x-mobipocket-ebook",
    ];
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];

    const validTypes =
      currentTab === "document" ? validDocumentTypes : validImageTypes;

    if (validTypes.includes(file.type)) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Invalid file type. Please upload a PDF, EPUB, or MOBI file.");
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      handleFile(uploadedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    // const isConfirmed = window.confirm(
    //   `Are you sure you want to remove the ${currentTab}?`
    // );
    // if (isConfirmed) {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // }
  };

  const handleSelectionChange = (key: Key) => {
    const keyString = key.toString();
    if (keyString !== currentTab) {
      handleReset();
    }
    setCurrentTab(keyString);
  };

  useEffect(() => {
    if (result) {
      try {
        const cleanedResult = result.replace(/```json|```/g, "").trim();
        const parsedResult = JSON.parse(cleanedResult);

        setIsError(false);
        setErrorMsg("");

        // Set the cards in the store
        setCards(parsedResult);

        // Navigate to the new page without query parameters
        router.push("/flashcard-generator/new");
      } catch (e) {
        setIsError(true);
        setErrorMsg("The " + currentTab + " could not be processed.");
      }
    }
  }, [result, currentTab, router, setCards]);

  return (
    <>
      <div className="h-[100svh] w-screen relative">
        <div className="absolute inset-0 z-0 flex flex-col justify-center items-center">
          <div className="w-full h-[40%] bg-gray-50" />
          <div className="w-full h-[60%] bg-gray-100" />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col justify-center pt-12 gap-5 container mx-auto px-32">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-start">
              <Tabs
                aria-label="Tab Options"
                selectedKey={currentTab}
                color="primary"
                size="lg"
                fullWidth={true}
                variant="underlined"
                disabledKeys={["text"]}
                onSelectionChange={handleSelectionChange}
              >
                <Tab key="text" title="Text" />
                <Tab key="document" title="Document" />
                <Tab key="image" title="Image" />
              </Tabs>
            </div>
            <div className="flex gap-3">
              <Button
                color="primary"
                startContent={<MdOutlineDone />}
                onClick={() =>
                  handleProcessAI(file, setIsProcessing, setResult)
                }
                isDisabled={!file}
              >
                Generate
              </Button>
              <Button
                color="danger"
                startContent={<IoReload />}
                onClick={handleReset}
                isDisabled={!file}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="w-full h-[40rem] flex flex-col justify-center md:flex-row gap-5">
            <Modal
              isOpen={isProcessing}
              onOpenChange={setIsProcessing}
              isDismissable={false}
              hideCloseButton={true}
              shadow="sm"
              size="xs"
              backdrop="blur"
              //   radius="none"
              //   className="bg-transparent"
            >
              <ModalContent>
                <ModalBody>
                  <Spinner label="Loading..." size="lg" />
                </ModalBody>
              </ModalContent>
            </Modal>

            <Modal
              isOpen={isError}
              onOpenChange={setIsError}
              isDismissable={false}
              hideCloseButton={true}
              shadow="sm"
              backdrop="blur"
            >
              <ModalContent>
                <ModalHeader>Error</ModalHeader>
                <ModalBody>
                  <h1>{errorMsg}</h1>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={() => {
                      setIsError(false);
                      setErrorMsg(null);
                      handleReset();
                    }}
                  >
                    OK
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {(currentTab === "document" || currentTab === "image") && (
              <Card className="w-full">
                <CardBody
                  className="p-0 flex justify-center items-center"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {preview ? (
                    currentTab === "document" ? (
                      <iframe
                        src={preview}
                        className="w-full h-full"
                        title="File Preview"
                      />
                    ) : currentTab === "image" ? (
                      <div className="w-full h-full flex justify-center items-center">
                        <img
                          src={preview}
                          alt="File Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : null
                  ) : (
                    <>
                      <input
                        type="file"
                        accept={
                          currentTab === "document"
                            ? ".pdf,.epub,.mobi"
                            : "image/*"
                        }
                        onChange={handleUpload}
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        id="fileUpload"
                      />
                      <label
                        htmlFor="fileUpload"
                        className="flex flex-col items-center gap-3"
                      >
                        {currentTab === "document" ? (
                          <GoFile color="gray" size={"4rem"} />
                        ) : (
                          <GoImage color="gray" size={"4rem"} />
                        )}
                        <span>
                          {currentTab.toLowerCase() === "document"
                            ? "Drag a file here"
                            : "Drag an image here"}
                        </span>
                        <span>- OR -</span>
                        <Button fullWidth onClick={triggerFileInput}>
                          Upload File
                        </Button>
                      </label>
                    </>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewComponent;

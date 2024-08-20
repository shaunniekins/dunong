"use client";

import NewFlashCardComponent from "@/components/NewFlashCard";
import { useFlashcardStore, useJsonDataStore } from "../flashcardStore";
import FlashCardCarousel from "@/components/FlashCardCarousel";
import { Button, Card, CardBody, Spacer, Tab, Tabs } from "@nextui-org/react";
import { SlPrinter } from "react-icons/sl";
import { FaRegEdit } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { Key, useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

import { firestoreDb } from "@/app/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const FlashcardGeneratorPage = () => {
  const cards = useFlashcardStore((state) => state.cards);
  const jsonData = useJsonDataStore((state) => state.jsonData);
  const [arrangement, setArrangement] = useState("chronological");
  const [displayedCards, setDisplayedCards] = useState(cards);
  const [currentIndexCarousel, setCurrentIndexCarousel] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (cards === null || cards.length === 0) {
      router.push("/flashcard-generator");
    }
  }, [cards, router]);

  const shuffleArray = (array: any[]) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const handleSelectionChange = (key: Key) => {
    const keyString = key.toString();
    if (keyString !== arrangement) {
      setArrangement(keyString);
    }
  };

  useEffect(() => {
    if (arrangement === "random") {
      setDisplayedCards(shuffleArray(cards));
      setCurrentIndexCarousel(0);
    } else {
      setDisplayedCards(cards);
      setCurrentIndexCarousel(0);
    }
  }, [arrangement, cards]);

  // console.log("cards", cards);
  // console.log("jsonData", jsonData);

  async function saveDataToFirestore() {
    try {
      const title = window.prompt("Enter the title:");
      if (!title) {
        console.error("Title is required");
        return;
      }

      const docRef = await addDoc(collection(firestoreDb, "flashcards"), {
        title: title,
        jsonData: jsonData,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div className="container mx-auto px-32 py-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Generated Flashcards</h1>
        <Button
          size="lg"
          className="bg-transparent"
          startContent={<IoMdArrowRoundBack size={20} />}
          onClick={() => router.push("/flashcard-generator")}
        >
          back
        </Button>
      </div>
      <div className="px-64">
        <FlashCardCarousel
          cards={displayedCards}
          currentIndex={currentIndexCarousel}
          setCurrentIndex={setCurrentIndexCarousel}
        />
        <Card className="mt-10 mb-7">
          <CardBody>
            <div className="w-full flex justify-between items-center px-3">
              <h1 className="text-lg font-semibold">Options</h1>
              <span className="flex space-x-2 invisible">
                <Button
                  isIconOnly
                  disableAnimation
                  size="lg"
                  className="bg-transparent"
                  startContent={<SlPrinter size={25} />}
                />
                <Button
                  isIconOnly
                  disableAnimation
                  size="lg"
                  className="bg-transparent"
                  startContent={<GoDownload size={25} />}
                />
                <Button
                  isIconOnly
                  disableAnimation
                  size="lg"
                  className="bg-transparent"
                  startContent={<FaRegEdit size={25} />}
                />
              </span>
            </div>
            <Spacer y={4} />
            <div className="w-full flex justify-between items-center px-3">
              <h3>Arrange Cards</h3>
              <Tabs
                aria-label="Arrangement Tab Options"
                selectedKey={arrangement}
                onSelectionChange={handleSelectionChange}
              >
                <Tab key="chronological" title="Chronological" />
                <Tab key="random" title="Random" />
              </Tabs>
            </div>
            <Spacer y={4} />
            <div className="w-full flex justify-between items-center px-3">
              <h3>Save Flashcard</h3>
              <Button color="secondary" onClick={saveDataToFirestore}>
                Save
              </Button>
            </div>
          </CardBody>
        </Card>
        <NewFlashCardComponent cards={displayedCards} />
      </div>
    </div>
  );
};

export default FlashcardGeneratorPage;

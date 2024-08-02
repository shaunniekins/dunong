"use client";

import { Card, CardBody } from "@nextui-org/react";
import React from "react";

interface CardDisplay {
  question: string;
  answer: string;
}

interface NewFlashCardComponentProps {
  cards: CardDisplay[];
}

const NewFlashCardComponent: React.FC<NewFlashCardComponentProps> = ({
  cards,
}) => {
  if (cards.length === 0) {
    return <p>No flashcards available.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="p-3"
        >
          <CardBody>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Question:
            </h3>
            <p className="text-gray-600 mb-4">{card.question}</p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Answer:
            </h3>
            <p className="text-gray-600">{card.answer}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default NewFlashCardComponent;

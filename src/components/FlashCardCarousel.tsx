import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import { IoChevronBackCircleOutline, IoChevronForwardCircleOutline } from "react-icons/io5";

interface CardDisplay {
  question: string;
  answer: string;
}

interface FlashCardCarouselProps {
  cards: CardDisplay[];
}

const FlashCardCarousel: React.FC<FlashCardCarouselProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return <div className="text-center text-xl">No flashcards available.</div>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 select-none">
      <motion.div
        className="w-full h-96 bg-white rounded-2xl shadow-lg cursor-pointer perspective-1000"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-full flex items-center justify-center p-12 backface-hidden text-center text-2xl">
          {isFlipped ? (
            <p className="counter-rotate">{cards[currentIndex].answer}</p>
          ) : (
            <p>{cards[currentIndex].question}</p>
          )}
        </div>
      </motion.div>
      <div className="flex items-center gap-x-16">
        <Button
          isIconOnly
          size="lg"
          className="bg-transparent"
          onClick={handlePrev}
          startContent={<IoChevronBackCircleOutline size={50} color="lightblue" />}
        />
        <div className="w-10 text-center">
          {currentIndex + 1} / {cards.length}
        </div>
        <Button
          isIconOnly
          size="lg"
          className="bg-transparent"
          onClick={handleNext}
          startContent={<IoChevronForwardCircleOutline size={50} color="lightblue" />}
        />
      </div>
    </div>
  );
};

export default FlashCardCarousel;

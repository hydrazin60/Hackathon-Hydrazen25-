import arrow from "../assets/icons/rightArrow.svg";
import { useState } from "react";

export default function QuestionsCard({ question, answer }) {
    const [showAnswer, setShowAnswer] = useState(false);
    const handleShowAnswer = () => {
        setShowAnswer(!showAnswer);
    }
  return (
    <div className="bg-card rounded-2xl p-5 text-white flex flex-col hover:cursor-pointer items-start justify-start" onClick={handleShowAnswer}>
      <div className="text-lg font-bold flex justify-between w-full">
        <span>{question}</span>
        <img src={arrow} alt="" className={`w-5 h-5 duration-300 ease-out ${showAnswer ? 'rotate-90': 'rotate-0'}`} />
      </div>
      <div className={`duration-200 overflow-hidden ${showAnswer ? '': 'h-0'}`}>{answer}</div>
    </div>
  );
}

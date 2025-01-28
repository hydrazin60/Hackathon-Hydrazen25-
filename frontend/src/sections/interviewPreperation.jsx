import InternshipCard from "../components/internshipCard";
import QuestionsCard from "../components/questionsCard";

export default function InterviewPreperation() {
  return (
    <>
      <div className="h-[90%] w-full flex p-8 gap-4 justify-center items-start">
        <div className="w-80 flex">
          <aside className="bg-[#161616] grow rounded-2xl text-white flex flex-col justify-center items-start p-12 gap-4">
            <div>Machine Learning</div>
            <div>Artificial Intelligence</div>
            <div>Frontend Development</div>
            <div>Backend Development</div>
            <div>Fullstack Development</div>
            <div>Data Science</div>
            <div>Cybersecurity</div>
            <div>DevOps</div>
            <div>Mobile Development</div>
            <div>Game Development</div>
          </aside>
        </div>
        <div className="flex-grow gap-2 flex flex-col max-h-full overflow-y-scroll hideScrollBar">
          <QuestionsCard question="What is React?" answer="React is a JavaScript library for building user interfaces." />
          <QuestionsCard question="What is a component in React?" answer="A component is a reusable piece of code that represents a part of the user interface." />
          <QuestionsCard question="What is state in React?" answer="State is an object that determines how a component renders and behaves." />
        </div>
      </div>
    </>
  );
}

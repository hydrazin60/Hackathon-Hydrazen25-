import "./App.css";
import Hero from "./sections/hero";
import InternshipHub from "./sections/internshipHub";
import ResumeBuilder from "./sections/resumeBuilder";
import InterviewPreperation from "./sections/interviewPreperation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/nav";

function App() {
  return (
    <>
      <div className="w-screen h-screen px-20 pt-6 bg-neutral flex flex-col items-center overflow-hidden">
        <BrowserRouter>
          <Nav />
          <div className="max-h-full w-full flex-grow ">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/InternshipHub" element={<InternshipHub />} />
              <Route path="/ResumeBuilder" element={<ResumeBuilder />} />
              <Route
                path="/InterviewPreperation"
                element={<InterviewPreperation />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <header className="w-full flex justify-center">
      <nav className="flex gap-12 whitespace-nowrap from-primary to-[#0C1839] via-primary px-16 py-4 rounded-full bg-linear-90">
        <Link className="text-white" to="/">Home</Link>
        <Link className="text-white" to="/InternshipHub">Internship Hub</Link>
        <Link className="text-white" to="/ResumeBuilder">Resume Builder</Link>
        <Link className="text-white" to="/InterviewPreperation">Interview Preperation</Link>
      </nav>
    </header>
  );
}

import InternshipCard from "../components/internshipCard";

export default function InternshipHub() {
  return (
    <>
      <div className="h-[90%] w-full flex p-8 gap-4 justify-center items-start">
        <div className="w-80 flex">
          <aside className="bg-card grow rounded-2xl text-white flex flex-col justify-center items-start p-12 gap-4">
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
          <InternshipCard
            Heading="Machine Learning Internship"
            location="Remote"
            company="Google"
            discription="Lorem ipsum dolor sit amet, consectetur elit. Quisque sit amet."
          />
          <InternshipCard
            Heading="Machine Learning Internship"
            location="Remote"
            company="Google"
            discription="Lorem ipsum dolor sit amet, consectetur elit. Quisque sit amet."
          />
          <InternshipCard
            Heading="Machine Learning Internship"
            location="Remote"
            company="Google"
            discription="Lorem ipsum dolor sit amet, consectetur elit. Quisque sit amet."
          />
        </div>
      </div>
    </>
  );
}

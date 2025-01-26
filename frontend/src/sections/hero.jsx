import globe from "../assets/img/globe.svg";
import { Link } from "react-router-dom";
import rightArrow from "../assets/icons/rightArrow.svg";

export default function Hero() {
  return (
    <>
      <div className="h-full w-full flex flex-col justify-center items-center overflow-hidden">
        <div className="flex flex-col items-center mt-32">
          <h1 className="text-4xl font-bold drop-shadow-[0_20px_20xp_rgba(255,255,255,1)]">Internship Hub</h1>
          <p className="text-lg">Your next internship is just a click away</p>
          <Link to="/InternshipHub">
            <div className="py-3 px-7 bg-primary rounded-full relative z-10 flex justify-center items-center gap-2">
              <span>Explore internship</span>
              <img src={rightArrow} alt="" />
            </div>
          </Link>
        </div>

        <div className="relative w-full h-full">
          <div className="h-[64rem] w-[64rem] bg-primary absolute rounded-full left-1/2 transform -translate-x-1/2 blur-[3rem] opacity-90"></div>
          <img
            src={globe}
            alt="earth globe image"
            className="h-[64rem] absolute left-1/2 transform -translate-x-1/2 top-[0%]"
          />
        </div>
      </div>
    </>
  );
}

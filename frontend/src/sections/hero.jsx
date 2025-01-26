import globe from "../assets/img/globe.png";
import { Link } from "react-router-dom";
import rightArrow from "../assets/icons/rightArrow.svg";

export default function Hero() {
  return (
    <>
      <div className="h-full w-full flex flex-col justify-between items-center gap-4">
        <div className="flex flex-col items-center justify-end h-[65%] relative z-10">
          <h1 className="text-6xl font-bold">Internship Hub</h1>
          <p className="text-lg">Your next internship is just a click away</p>
          <Link to="/InternshipHub">
            <div className="mt-2 py-3 px-7 bg-primary rounded-full relative z-10 flex justify-center items-center gap-2">
              <span>Explore internship</span>
              <img src={rightArrow} alt="" />
            </div>
          </Link>
        </div>

        <div style={{position: "relative"}} className="w-full h-full grow">
          <div className="h-[90rem] w-[90rem] bg-primary absolute rounded-full left-1/2 transform -translate-x-1/2 blur-[100rem] opacity-90"></div>
          <img
            src={globe}
            style={{}}
            alt="earth globe image"
            className="h-[200%] absolute left-1/2 transform -translate-x-1/2"
          />
        </div>
      </div>
    </>
  );
}

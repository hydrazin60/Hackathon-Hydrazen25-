import globe from "../assets/img/globe.png";
import { Link } from "react-router-dom";
import rightArrow from "../assets/icons/rightArrow.svg";
import { useState } from "react";

export default function Hero() {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };
  return (
    <>
      <div className="h-full w-full flex flex-col justify-between items-center gap-4">
        <div className="flex flex-col items-center justify-end h-[65%] relative z-10">
          <span className="text-[4rem] font-bold">INTERNSHIP HUB</span>
          <p className="text-lg">Your next internship is just a click away</p>
          {/* <Link to="/InternshipHub"> */}
          <div
            className={`mt-2 py-3 px-7 bg-primary rounded-full relative z-10 flex justify-center items-center gap-2`}
            onClick={handleClick}
            style={{ transitionDuration: "1s" }}
          >
            <span
              className={`overflow-hidden transition-all duration-1000 ${
                isClicked ? "w-0" : "w-full"
              }`}
              style={{ whiteSpace: "nowrap" }}
            >
              Explore internship
            </span>
            <img
              src={rightArrow}
              alt=""
              className={`transition-transform duration-1000 ${
                isClicked ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          {/* </Link> */}
        </div>

        <div style={{ position: "relative" }} className="w-full h-full grow">
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

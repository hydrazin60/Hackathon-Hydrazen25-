export default function InternshipCard({
  Heading,
  location,
  company,
  discription,
}) {
return (
    <div className="bg-card w-full rounded-2xl flex flex-col justify-start items-start p-8 gap-2">
        <div className="font-bold text-xl">{Heading}</div>
        <div className="flex justify-start flex-col items-start">
            <div className="flex justify-start items-start gap-2">
                <span className="font-bold">Location:</span> <span>{location}</span>
            </div>
            <div className="flex justify-start items-start gap-2">
                <span className="font-bold">Company:</span> <span>{company}</span>
            </div>
            <div className="flex justify-start items-start gap-2">
                <span className="font-bold">Discription:</span>{" "}
                <span className="text-start">{discription}</span>
            </div>
        </div>
        <div className="bg-primary px-4 py-2 rounded-lg">Learn More</div>
    </div>
);
}

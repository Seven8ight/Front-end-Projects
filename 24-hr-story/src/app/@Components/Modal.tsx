import { useState, useEffect, Dispatch, SetStateAction } from "react";
import DurationBar from "./DurationBar";
import { type media } from "../page";

type Props = {
  items: media[];
  index?: number;
  handler: Dispatch<SetStateAction<boolean>>;
};

const ModalElement = ({ items, index, handler }: Props): React.ReactNode => {
  const [Index, setIndex] = useState<number>(index || 0);
  const [duration, setDuration] = useState<number>(5000); // Default duration

  useEffect(() => {
    // If current item is a video and has a custom duration, update it
    if (items[Index].type === "Video" && items[Index].duration) {
      setDuration(items[Index].duration);
    } else {
      // Set default duration for non-video items (e.g., images)
      setDuration(5000);
    }

    // Interval to switch items
    const switchInterval = setInterval(() => {
      if (Index + 1 === items.length) {
        handler(false); // Close the modal if we've reached the last item
      } else {
        setIndex((current) => current + 1);
      }
    }, duration); // Duration is passed based on the media type

    return () => {
      clearInterval(switchInterval); // Clean up interval on component unmount
    };
  }, [Index, items, duration, handler]);

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowRight":
        handleIndex("forward");
      case "ArrowLeft":
        handleIndex("back");
      default:
    }
  });

  const handleIndex = (type: "back" | "forward") => {
    if (type === "forward" && Index + 1 < items.length) {
      setIndex((index) => index + 1);
    } else if (type === "back" && Index - 1 >= 0) {
      setIndex((index) => index - 1);
    } else if (type == "forward" && Index + 1 == items.length) handler(false);
  };

  return (
    <div
      id="container"
      className="bg-gray-500 h-[100vh] w-[100vw] absolute top-0 p-1"
    >
      <button
        className="relative left-[475px] top-10 text-white"
        onClick={() => handler(false)}
      >
        X
      </button>
      <div
        id="element"
        className="w-[400px] h-[700px] m-auto rounded-2xl bg-black relative top-10"
      >
        <div id="back" className="relative top-72 right-10">
          <button className="text-white" onClick={() => handleIndex("back")}>
            &lt;
          </button>
        </div>
        <div id="forward" className="relative top-[264px] left-[420px]">
          <button className="text-white" onClick={() => handleIndex("forward")}>
            &gt;
          </button>
        </div>

        {/* DurationBar: Only one bar for the whole modal, adjusting based on duration */}
        <div className="flex justify-between gap-1">
          {items.map((item) => (
            <DurationBar key={`${item.id}`} duration={duration} />
          ))}
        </div>

        {/* Display media: Image or Video */}
        <div>
          {items[Index].type === "Image" ? (
            <img
              src={items[Index].url}
              className="absolute top-[15%] object-contain"
            />
          ) : (
            <video
              src={items[Index].url}
              autoPlay
              loop
              muted
              className="absolute top-[15%] object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalElement;

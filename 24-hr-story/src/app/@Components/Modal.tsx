import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import DurationBar from "./DurationBar";
import { type media } from "../page";

type Props = {
  items: media[];
  index?: number;
  handler: Dispatch<SetStateAction<boolean>>;
};

const ModalElement = ({ items, index, handler }: Props): React.ReactNode => {
  const [Index, setIndex] = useState<number>(index || 0);
  const [duration, setDuration] = useState<number>(5000),
    intervalRef = useRef<NodeJS.Timeout>(null); // Default duration

  const handleIndex = (type: "back" | "forward") => {
    if (type === "forward" && Index + 1 < items.length) {
      setIndex((index) => index + 1);
    } else if (type === "back" && Index - 1 >= 0) {
      setIndex((index) => index - 1);
    } else if (type === "forward" && Index + 1 == items.length) handler(false);
  };

  useEffect(() => {
    const startInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (items[Index].type === "Video" && items[Index].duration) {
        setDuration(items[Index].duration);
        intervalRef.current = setInterval(() => {
          if (Index + 1 === items.length) handler(false);
          else setIndex((current) => current + 1);
        }, items[Index].duration * 1000);
      } else {
        intervalRef.current = setInterval(() => {
          if (Index + 1 === items.length) handler(false);
          else setIndex((current) => current + 1);
        }, duration);
      }
    };

    startInterval();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [Index, items, handler]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          if (items[Index + 1] !== undefined) handleIndex("forward");
          break;
        case "ArrowLeft":
          if (items[Index - 1] !== undefined) handleIndex("back");
          break;
        default:
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [Index, items, handleIndex]);

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
            <DurationBar key={`${item.id}`} />
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

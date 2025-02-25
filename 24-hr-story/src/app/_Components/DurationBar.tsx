import { useEffect, useRef } from "react";

const DurationBar = (): React.ReactNode => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transition = "all 5s ease-in-out";
      ref.current.style.transform = "scaleX(1)";
    }
  }, []);

  return (
    <div
      id="bar"
      className="w-full h-1 bg-black rounded-2xl relative bottom-16"
    >
      <div id="highlighter" ref={ref}></div>
    </div>
  );
};

export default DurationBar;

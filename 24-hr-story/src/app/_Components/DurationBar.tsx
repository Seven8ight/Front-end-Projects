import { useEffect, useRef } from "react";

const DurationBar = (): React.ReactNode => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref) ref.current?.classList.add("animate");
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

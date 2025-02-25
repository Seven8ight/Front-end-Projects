import { useState, useEffect } from "react";

const DurationBar = ({ duration }: { duration: number }): React.ReactNode => {
  const [isScaled, setIsScaled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScaled(true);
      console.log("Scaled!"); // Debugging
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      id="bar"
      className="w-full h-1 bg-black rounded-2xl relative bottom-16"
    >
      <div
        id="highlighter"
        key={`highlighter-${isScaled}`}
        className={`h-1 bg-white rounded-2xl transition-all duration-5000 ${
          isScaled ? "scale-x-100" : "scale-x-0"
        }`}
        style={{ transitionProperty: "transform" }}
      ></div>
    </div>
  );
};

export default DurationBar;

import { useState } from "react";

const Timer = (): React.ReactNode => {
  const [state, setState] = useState<string>("Focus");

  return (
    <div id="timer">
      <h1>{state}</h1>
      <div id="container">
        <h2>00:00</h2>
        <div id="icons">
          <button>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button>
            <i className="fa-solid fa-pause"></i>
          </button>
          <button>
            <i className="fa-solid fa-rotate-left"></i>
          </button>
          <button>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;

import React, { useEffect, useReducer, useState, useContext } from "react";
import { Timings } from "./Context/Provider";

type action =
  | { type: "Short break" }
  | { type: "Focus" }
  | { type: "Long break" };
type state = {
  current: "focus" | "longBreak" | "shortBreak";
};

const reducer = (_: state, action: action): state => {
  switch (action.type) {
    case "Short break":
      return { current: "shortBreak" };

    case "Focus":
      return { current: "focus" };

    case "Long break":
      return { current: "longBreak" };
  }
};

const Timer = (): React.ReactNode => {
  const { times } = useContext(Timings),
    [state, dispatch] = useReducer(reducer, { current: "focus" }),
    [minutes, setMinutes] = useState<number>(times.focus),
    [seconds, setSeconds] = useState<number>(0),
    [pause, setPause] = useState<boolean>(true);

  useEffect(() => {
    setMinutes(times[state.current]);
  }, [state.current, times]);

  useEffect(() => {
    let refresher = setInterval(() => {
      if (pause == false) {
        setSeconds((seconds) => seconds - 1);
        if (seconds == 0) {
          setSeconds(59);
          setMinutes((minutes) => minutes - 1);
        }
      }
    }, 1000);

    return () => clearInterval(refresher);
  }, [pause, minutes, seconds]);

  const changeState = (event: React.MouseEvent<HTMLButtonElement>) => {
    const element = (event.target as HTMLButtonElement).parentElement;
    setPause(true);
    if (element?.id == "back") {
      switch (state.current) {
        case "focus":
          dispatch({ type: "Short break" });
          setMinutes(5);
          setSeconds(0);
          break;
        case "longBreak":
          dispatch({ type: "Focus" });
          setMinutes(25);
          setSeconds(0);
          break;
        case "shortBreak":
          dispatch({ type: "Long break" });
          setMinutes(30);
          setSeconds(0);
          break;
      }
    } else if (element?.id == "forward") {
      switch (state.current) {
        case "focus":
          dispatch({ type: "Long break" });
          break;
        case "longBreak":
          dispatch({ type: "Short break" });
          break;
        case "shortBreak":
          dispatch({ type: "Focus" });
          break;
      }
    }
  };

  const timingFunctions = (event: React.MouseEvent<HTMLButtonElement>) => {
    let btn = (event.target as HTMLButtonElement).parentElement;

    if (btn?.id == "pause") setPause((pause) => !pause);
    if (btn?.id == "reset") {
      setPause(true);
      switch (state.current) {
        case "focus":
          setMinutes(25);
          setSeconds(0);
          break;
        case "longBreak":
          setMinutes(30);
          setSeconds(0);
          break;
        case "shortBreak":
          setMinutes(5);
          setSeconds(0);
          break;
      }
    }
  };

  return (
    <div id="timer">
      <h1>{state.current}</h1>
      <div id="container">
        <h2>
          {minutes}:
          {seconds >= 10 ? seconds : seconds.toString().padStart(2, "0")}
        </h2>
        <div id="icons">
          <button onClick={changeState} id="back">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button id="pause" onClick={timingFunctions}>
            {pause == true ? (
              <i className="fa-solid fa-play"></i>
            ) : (
              <i className="fa-solid fa-pause"></i>
            )}
          </button>
          <button id="reset" onClick={timingFunctions}>
            <i className="fa-solid fa-rotate-left"></i>
          </button>
          <button id="forward" onClick={changeState}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;

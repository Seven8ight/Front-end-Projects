import React, { createContext, useContext, useState } from "react";

export type defaults = {
  focus: number;
  longBreak: number;
  shortBreak: number;
};

export type newValue = {
  id: keyof defaults; // Use keyof for type safety
  input: number;
};

export type timeType = {
  times: defaults;
  setTimes: (newValue: newValue) => void; // Correct type here
};

export const Timings = createContext<timeType>({
  times: { focus: 25, longBreak: 15, shortBreak: 5 },
  setTimes: (_: newValue) => {},
});

const useTimes = () => {
  const times = useContext(Timings);
  if (!times) throw "Use within the parent provider";
  return times;
};

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [changes, setChanges] = useState<defaults>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const updateValue = (newValue: newValue) => {
    setChanges((prevValues) => ({
      ...prevValues,
      [newValue.id]: newValue.input,
    }));
  };

  return (
    <Timings.Provider value={{ times: changes, setTimes: updateValue }}>
      {children}
    </Timings.Provider>
  );
};

export { useTimes, Provider };

import { createContext, useState } from "react";

export type finalResults = {
  finalResult: number;
  setResult: React.Dispatch<React.SetStateAction<number>>;
};

export const FinalResult = createContext<finalResults | undefined>(undefined);

const ResultsProvider = ({ children }: { children: React.ReactNode }) => {
  const [result, setResult] = useState<number>(0);

  return (
    <FinalResult.Provider value={{ finalResult: result, setResult: setResult }}>
      {children}
    </FinalResult.Provider>
  );
};

export default ResultsProvider;

import { AnimatePresence } from "framer-motion";
import Home from "./Components/Home";
import Questions from "./Components/Questions";
import Results from "./Components/Results";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Suspense } from "react";

const AnimatedRoutes = (): React.ReactNode => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index path="/" element={<Home />}></Route>
        <Route
          path="/qns"
          element={
            <Suspense fallback={<div>Loading</div>}>
              <Questions />
            </Suspense>
          }
        ></Route>
        <Route path="/results" element={<Results />}></Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = (): React.ReactNode => {
  return (
    <>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  );
};

export default App;

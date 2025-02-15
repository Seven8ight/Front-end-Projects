import { useContext } from "react";
import { FinalResult } from "./Context/ResultsProvider";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const containerVariants = {
    hidden: {
      x: -1000,
    },
    visible: {
      x: 0,
      transition: {
        duration: 1,
        delayChildren: 1,
        staggerChildren: 1,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
    },
  },
  resultVariants = {
    hidden: {
      x: -1000,
    },
    visible: {
      x: 0,
      transition: {
        delayChildren: 1,
        staggerChildren: 1,
      },
    },
  },
  buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "10px 10px 5px 0 rgba(150,150,150,.3)",
    },
  },
  textVariants = {
    hidden: {
      x: -1000,
    },
    visible: {
      x: 0,
    },
  };

const Results = (): React.ReactNode => {
  const results = useContext(FinalResult),
    navigate = useNavigate();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-[100vw] h-[100vh] bg-linear-to-bl from-[#f6d5f7] to-[#fbe9d7] bg-fixed bg-cover"
      >
        <motion.div
          variants={resultVariants}
          className="m-auto relative top-[300px] text-center leading-10 w-96 h-auto shadow-2xl border-2 rounded-2xl p-5"
        >
          <motion.h1
            className="underline text-2xl font-[Cookie]"
            variants={textVariants}
          >
            Results
          </motion.h1>
          <motion.p variants={textVariants}>
            {results?.finalResult} / 5,{" "}
            {results?.finalResult && results.finalResult >= 3
              ? "Good job"
              : "Don't worry you can do better"}
          </motion.p>
          <motion.button
            className="p-1 border rounded-2xl w-20 hover:cursor-pointer"
            variants={buttonVariants}
            whileHover="hover"
            onClick={() => {
              navigate("/");
              results?.setResult && results.setResult(0);
            }}
          >
            Re-do
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Results;

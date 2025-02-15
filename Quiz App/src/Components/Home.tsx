import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
    hidden: {
      opacity: 0,
      x: -500,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        type: "Spring",
        stiffness: 300,
        delayChildren: 1,
      },
    },
    exit: {
      x: -500,
      opacity: 0,
    },
  },
  buttonVariants = {
    initial: {
      style: {
        backgroundColor: "transparent",
        color: "black",
      },
    },
    hover: {
      scale: 1.1,
      boxShadow: "10px 5px 5px 0 rgba(50,50,50,.7)",
      style: {
        backgroundColor: "rgba(100,100,100,.8)",
        color: "white",
      },
    },
    onclick: {
      transform: "scale(0.9)",
    },
  },
  textVariants = {
    hidden: {
      x: -100,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
    },
  };

const Home = (): React.ReactNode => {
  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-[100vh] bg-gray-400"
        exit="exit"
      >
        <header>
          <motion.h1
            className="font-[Asap] underline text-center text-2xl relative top-64"
            variants={textVariants}
          >
            Biology
          </motion.h1>
        </header>
        <motion.div className="text-center relative top-72">
          <motion.h2 className="font-[Cookie] text-xl">
            Test your knowledge on biology with the following questions.
          </motion.h2>
          <motion.button
            className="p-2 w-20 border-2 rounded-xl font-[Lobster_Two] hover:cursor-pointer mt-8"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="onclick"
          >
            <Link to="/qns">Begin</Link>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;

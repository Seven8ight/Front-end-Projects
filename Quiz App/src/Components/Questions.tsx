import { useEffect, useState, useContext } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FinalResult } from "./Context/ResultsProvider";

type questions = {
  id: number;
  qn: string;
  answ: string[];
};
type question = {
  qnNumber: number;
  correct: boolean;
};

const containerVariants = {
  hidden: {
    opacity: 0,
    x: -500,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "tween",
      duration: 2,
    },
  },
  exit: {
    opacity: 0,
    x: -500,
  },
};

const Questions = (): React.ReactNode => {
  const [qns, setQns] = useState<questions[] | []>(),
    [_, setError] = useState<boolean>(false),
    [index, setIndex] = useState<number>(1),
    [correct, setCorrect] = useState<question[]>([]),
    setter = useContext(FinalResult),
    answers: number[] = [0, 0, 1, 0, 0],
    navigate = useNavigate(),
    controls = useAnimation();

  const resetAnimation = () => {
    controls.set({
      width: 0,
    });
    controls.start({
      width: "100%",
    });
  };

  useEffect(() => {
    const fetcher = async (): Promise<questions[] | []> => {
      try {
        let request = await fetch("http://localhost:3000/Questions");

        if (!request.ok) {
          setError(true);
        }

        return await request.json();
      } catch (error) {
        setError(true);
        return [];
      }
    };
    fetcher().then((data) => setQns(data));
    resetAnimation();
  }, []);

  useEffect(() => {
    let inserted: boolean = false,
      durationInterval = setInterval(() => {
        if (correct.length < index && !inserted) {
          setCorrect([
            ...correct,
            {
              qnNumber: index,
              correct: false,
            },
          ]);
          if (setter?.finalResult && setter.finalResult > 0)
            setter.setResult((result) => result - 1);
          inserted = true;
        }
        setIndex((currentIndex) => {
          return Math.min(currentIndex + 1, 5);
        });
      }, 15000);

    return () => clearInterval(durationInterval);
  }, [index]);

  const indexAndCorrecthHandler = (event: React.MouseEvent): void => {
    if (index < 5) setIndex((index) => index + 1);

    let btnClicked = event.target as HTMLButtonElement,
      isCorrect: boolean = false;
    btnClicked.style.transition = "background-color .5s ease-in-out";

    if (Number(btnClicked.id) == answers[index - 1]) {
      isCorrect = true;
      setter?.setResult((result) => result + 1);
      btnClicked.style.backgroundColor = "green";
    } else {
      btnClicked.style.backgroundColor = "red";
      setter?.setResult((result) => result - 1);
    }

    setTimeout(() => {
      btnClicked.style.backgroundColor = "transparent";
    }, 300);

    setCorrect([
      ...correct,
      {
        qnNumber: index,
        correct: isCorrect,
      },
    ]);
    resetAnimation();
  };

  if (correct.length == 5) navigate("/results");
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full h-[100vh] bg-linear-to-br from-[#ffa585] to-[#ffeda0] bg-fixed bg-cover"
      >
        <motion.div
          id="qns"
          className="m-auto w-[550px] h-[400px] border-2 shadow-2xl rounded-xl relative top-48"
        >
          <motion.div
            id="timer"
            className="w-full h-2 border-2 absolute rounded-[10px] top-[-20px]"
          >
            <motion.div
              initial={{
                width: 0,
              }}
              animate={controls}
              transition={{
                duration: 15,
                ease: "easeInOut",
                repeat: 5,
                repeatType: "reverse",
              }}
              className="bg-black h-1 rounded-[5px]"
            ></motion.div>
          </motion.div>

          <motion.div className="border-l-2 border-r-2 w-[90%] h-[30%] p-4 m-auto rounded-xl relative top-36 flex-col content-center text-center">
            {qns && qns.length > 0 && (
              <>
                <motion.h1
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 1,
                    delay: 1,
                  }}
                  className="text-center underline font-[Asap] relative bottom-10 text-lg"
                >
                  Qn {`${index}`}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  {qns[index - 1].qn}
                </motion.p>
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          id="answers"
          className="m-auto w-[550px] h-[60px] border-2 rounded-xl relative top-52 shadow-[10px_10px_10px_0_rgba(100,100,100,.5)] flex justify-around items-center p-4"
        >
          {qns &&
            qns.length &&
            qns[index - 1].answ.map((ans, index) => {
              return (
                <motion.button
                  id={`${index}`}
                  className="border-2 rounded-xl text-[12px] w-20 h-10 hover:cursor-pointer text-sm"
                  initial={{
                    opacity: 0,
                    y: 100,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1,
                      delay: 1,
                    },
                  }}
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={indexAndCorrecthHandler}
                  key={index}
                >
                  {ans}
                </motion.button>
              );
            })}
        </motion.div>

        <motion.h2 className="font-[Dancing_Script] text-center underline absolute top-[160px] right-[335px] text-xl">
          Score
        </motion.h2>

        <motion.div
          id="scores"
          className="m-auto w-[120px] h-[400px] border-2 rounded-2xl absolute top-[191px] right-72 drop-shadow-2xl shadow-2xl"
        >
          <ol className="text-center h-full flex-col justify-between font-[Lobster_Two] leading-10 relative top-20">
            {correct &&
              correct.map((element) => (
                <motion.li
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={element.qnNumber}
                >
                  {element.qnNumber}.{" "}
                  {element.correct == true ? "Correct" : "Incorrect"}
                </motion.li>
              ))}
          </ol>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Questions;

import { JSX, useState } from "react";
import { newValue, useTimes } from "./Context/Provider";
import { AnimatePresence, motion } from "framer-motion";

const modalVariants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: {
    x: 100,
    opacity: 0,
  },
};

const SettingsModal = (): JSX.Element => {
  const { times, setTimes } = useTimes();
  const [changes, setChanges] = useState(times);

  const handleInputChange = (newValues: newValue) => {
    setChanges((prevChanges) => ({
      ...prevChanges,
      [newValues.id]: Number(newValues.input),
    }));
  };

  const submission = () => {
    for (const id in changes) {
      if (changes.hasOwnProperty(id)) {
        const input = changes[id as keyof typeof changes];
        setTimes({ id: id as keyof typeof times, input } as newValue);
      }
    }
  };

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      id="modal"
      exit="exit"
      transition={{
        duration: 1,
      }}
    >
      <h1>Settings</h1>
      <div>
        <p>Pomodoro</p>
        <input
          type="number"
          id="Focus"
          onChange={(event) =>
            handleInputChange({
              id: "focus",
              input: Number(event.target.value),
            })
          }
          placeholder={`${times.focus}`}
        />
        <p>Short Break</p>
        <input
          type="number"
          id="ShortBreak"
          onChange={(event) =>
            handleInputChange({
              id: "shortBreak",
              input: Number(event.target.value),
            })
          }
          placeholder={`${times.shortBreak}`}
        />
        <p>Long break</p>
        <input
          type="number"
          id="LongBreak"
          onChange={(event) =>
            handleInputChange({
              id: "longBreak",
              input: Number(event.target.value),
            })
          }
          placeholder={`${times.longBreak}`}
        />
      </div>
      <button type="submit" onClick={submission}>
        Submit
      </button>
    </motion.div>
  );
};

const Settings = (): React.ReactNode => {
  const [open, setOpen] = useState<boolean>(false);

  const openModal = () => {
    setOpen((open) => !open);
  };

  return (
    <div id="settings">
      <div>
        <button onClick={openModal}>
          <i className="fa-solid fa-sliders"></i>
        </button>
      </div>
      <AnimatePresence>{open && <SettingsModal />}</AnimatePresence>
    </div>
  );
};

export default Settings;

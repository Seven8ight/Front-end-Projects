import { useEffect, useState } from "react";

const qns = [
  {
    id: 1,
    qn: "What is a callback?",
    ans: "A callback, also referred to as a callback function, is a function that is passed as an argument to another function and is then executed (called back) after the completion of that function. Callback functions are commonly used in JavaScript, particularly in asynchronous operations such as AJAX requests or event handling.",
  },
  {
    id: 2,
    qn: "What is a Promise object and how can it be used?",
    ans: `The Promise object in JavaScript is used to handle asynchronous operations.
          A Promise represents a value that may not be available at the time the Promise is created, but may be available in the future, or never at all.A Promise object can be in one of three states"
          1. Pending - operation is still ongoing, not finished either successfully or with errors.
          2. Fulfilled - operation completed successfully, Promise returned a value.
          3. Rejected - operation completed with an error, Promise returned the reason for the error.
            
          A Promise that has been fulfilled or rejected is considered settled and its state never changes.",`,
  },
  {
    id: 3,
    qn: "What is a lexical Scope",
    ans: "Lexical scope in JavaScript is a principle where the visibility range of a variable is determined by its location in the code. This means that variables are accessible inside the block in which they were defined, as well as in any nested blocks. This enables the creation of closures and control over variable access.",
  },
  {
    id: 4,
    qn: "Define an arrow function and some of its advantages",
    ans: "An arrow function, also known as arrow function, is a type of function introduced in ECMAScript 6 (ES6). They are called arrow functions because they use a special syntax with an arrow ( => ) to define the function.",
  },
  {
    id: 5,
    qn: "What is the nullish coalescing operator and how does it work?",
    ans: "The Nullish Coalescing Operator (??) is a logical operator that returns the right-hand side of the operation when the left-hand side is null or undefined. In other words, when a variable is empty, the nullish coalescing operator returns the defined value as a result.",
  },
];

const ProgressBar = (): React.ReactNode => {
  return (
    <div id="bar">
      <div id="highlighter"></div>
      <p id="currentqn">1 of 5</p>
    </div>
  );
};

const QnArea = ({
  showAnswer,
  currentQn,
}: {
  showAnswer: boolean;
  currentQn: Number;
}): React.ReactNode => {
  let qn: { id: Number; qn: string; ans: string } | undefined = qns.find(
    (element) => element.id == currentQn
  );

  return (
    <div id="questions">
      {showAnswer == false ? (
        <div id="qn">
          <p>{qn?.qn}</p>
        </div>
      ) : (
        <div id="ans">
          <p>{qn?.ans}</p>
        </div>
      )}
    </div>
  );
};

const StatusBar = ({
  onBack,
  onAnswer,
  onForward,
}: {
  onBack: () => void;
  onAnswer: () => void;
  onForward: () => void;
}): React.ReactNode => {
  return (
    <div id="bar2">
      <button onClick={onBack}>
        <i className="fa-solid fa-backward"></i> Previous
      </button>
      <button id="answerBtn" onClick={onAnswer}>
        Show Answer
      </button>
      <button onClick={onForward}>
        Next <i className="fa-solid fa-forward"></i>
      </button>
    </div>
  );
};

const Border = (): React.ReactNode => {
  const [currentQn, setCurrentQn] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);

  const onForward = (): void => {
      if (currentQn + 1 <= qns.length) {
        setCurrentQn((currentQn) => currentQn + 1);
        if (showAnswer) {
          setShowAnswer((show) => !show);
        }
      }
    },
    onBack = (): void => {
      if (currentQn - 1 != 0) {
        setCurrentQn((currentQn) => currentQn - 1);
      }
      if (showAnswer) {
        setShowAnswer((show) => !show);
      }
    },
    onAnswer = (): void => {
      setShowAnswer((showAnswer) => !showAnswer);
    };

  useEffect(() => {
    let highlighter: HTMLElement | null =
        document.getElementById("highlighter"),
      currentQnNumber: HTMLElement | null =
        document.getElementById("currentqn");
    let result = (currentQn / qns.length) * 100;
    console.log(result);

    if (highlighter && currentQnNumber) {
      highlighter.style.width = `${result}%`;
      currentQnNumber.innerHTML = `${currentQn} / ${qns.length}`;
    }
  }, [currentQn]);

  useEffect(() => {
    let answerBtn: HTMLElement | null = document.getElementById("answerBtn");
    if (answerBtn) {
      if (showAnswer) answerBtn.innerHTML = "Hide Answer";
      else answerBtn.innerHTML = "Show Answer";
    }
  }, [showAnswer]);

  return (
    <div id="parent">
      <ProgressBar />
      <QnArea currentQn={currentQn} showAnswer={showAnswer} />
      <StatusBar onForward={onForward} onBack={onBack} onAnswer={onAnswer} />
    </div>
  );
};

export default Border;

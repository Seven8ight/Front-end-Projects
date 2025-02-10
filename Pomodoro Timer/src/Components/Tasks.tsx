import { motion } from "framer-motion";
import { useRef, useState } from "react";

type task = {
  id: number;
  task: string;
  status: "Incomplete" | "Complete";
};

const Tasks = (): React.ReactNode => {
  const [tasks, setTasks] = useState<task[] | []>([]),
    [input, setInput] = useState<string>(""),
    taskAddRef = useRef<HTMLButtonElement>(null);

  if (taskAddRef.current)
    taskAddRef.current.onclick = () => {
      setTasks([
        ...tasks,
        {
          id: tasks.length === 0 ? 1 : tasks.length + 1,
          task: input,
          status: "Incomplete",
        },
      ]);
      setInput("");
    };

  const deleteTask = (id: number) => {
    let newTask = tasks
      .filter((task) => task.id !== id)
      .map((task, index) => ({ ...task, id: index + 1 }));
    setTasks(newTask);
  };

  const updateStatus = (id: number) => {
    const taskTitle = document.getElementById(`task-${id}`) as HTMLHeadElement;

    let currentTask = tasks.find((task) => task.id === id);
    taskTitle.style.textDecoration =
      currentTask?.status == "Complete" ? "none" : "line-through";

    setTasks(
      [...tasks].map((task) => {
        if (task.id === id)
          return {
            ...task,
            status: task.status == "Complete" ? "Incomplete" : "Complete",
          };
        return task;
      })
    );
  };

  return (
    <motion.div id="tasks">
      <header>
        <h1>Tasks</h1>
      </header>

      <div id="input">
        <input
          type="text"
          onChange={(event) => setInput(event.target.value)}
          value={input}
          placeholder="Task Name"
        />
        <button ref={taskAddRef}>Submit</button>
      </div>

      <motion.div id="currentTasks">
        {tasks.length == 0 && <p>No tasks, add some here</p>}
        {tasks.length > 0 &&
          tasks.map((task) => (
            <div key={task.id} id={`task-${task.id}`}>
              <h3>{task.task}</h3>
              <div>
                <button onClick={() => updateStatus(task.id)}>
                  {task.status == "Complete" ? (
                    <i className="fa-solid fa-check"></i>
                  ) : (
                    <i className="fa-solid fa-square-check"></i>
                  )}
                </button>
                <button id="delete" onClick={() => deleteTask(task.id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
      </motion.div>
    </motion.div>
  );
};

export default Tasks;

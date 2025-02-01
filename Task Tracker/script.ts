type Task = {
  id: number;
  task: string;
  status: "Incomplete" | "Complete";
};
type TasksArray = Task[];
type taskFunction = (event: Event, task: number) => void;

let tasks: TasksArray = [];

const tasksContainer = document.getElementById("tasks") as HTMLDivElement,
  newTaskBtn = document.getElementById("submit") as HTMLButtonElement,
  taskInput = document.getElementById("task") as HTMLInputElement;

const renderTasks = (): void => {
  tasksContainer.innerHTML = "";

  tasks.sort((a, b) => b.status.localeCompare(a.status));

  if (tasks.length === 0) {
    const taskDescription = document.createElement("p");
    taskDescription.id = "empty";
    taskDescription.innerHTML = "No tasks present, add some to fill here";
    taskDescription.classList.add("styles");
    tasksContainer.appendChild(taskDescription);
  } else {
    tasks.forEach((task) => {
      const taskContainer = document.createElement("div"),
        taskDesc = document.createElement("p"),
        iconDiv = document.createElement("div"),
        taskStatus = document.createElement("input"),
        deleteBtn = document.createElement("button");

      taskDesc.textContent = task.task;
      taskStatus.type = "checkbox";
      taskStatus.checked = task.status === "Complete";
      taskStatus.onchange = (event) => changeStatus(event, task.id);
      deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      deleteBtn.onclick = (event) => deleteTask(event, task.id);

      if (task.status === "Complete") {
        taskDesc.style.textDecoration = "line-through";
      }

      iconDiv.append(taskStatus, deleteBtn);
      iconDiv.classList.add("iconDiv");
      taskContainer.append(taskDesc, iconDiv);
      taskContainer.classList.add("taskStyles");
      tasksContainer.appendChild(taskContainer);
    });
  }
};

const addTask = (input: HTMLInputElement): void => {
  if (input.value.trim() === "") {
    taskInput.style.borderBottomColor = "red";
  } else {
    tasks.push({
      id: tasks.length + 1,
      task: input.value.trim(),
      status: "Incomplete",
    });
    taskInput.value = "";
    renderTasks();
  }
};

const deleteTask: taskFunction = (event: Event, taskId: number): void => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
};

const changeStatus: taskFunction = (event: Event, taskId: number): void => {
  const currentTask = tasks.find((task) => task.id === taskId);
  if (currentTask) {
    currentTask.status = (event.target as HTMLInputElement).checked
      ? "Complete"
      : "Incomplete";
    renderTasks();
  }
};

newTaskBtn.onclick = () => addTask(taskInput);
renderTasks();

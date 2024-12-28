export const addTask = (title, todoList, completedList, saveTasks) => {
	if (!title || !title.trim()) return;
	const task = { title, completed: false };
	renderTask(task, todoList, completedList, saveTasks);
	saveTasks();
};

export const toggleTaskCompletion = (
	li,
	task,
	todoList,
	completedList,
	saveTasks,
) => {
	const circle = li.querySelector(".todo-circle");
	li.classList.toggle("completed");

	toggleTaskClasses(circle, li.classList.contains("completed"));

	const targetList = li.classList.contains("completed")
		? completedList
		: todoList;
	targetList.appendChild(li);
	saveTasks();
};

export const deleteTask = (li, saveTasks) => {
	li.remove();
	saveTasks();
};

const toggleTaskClasses = (circle, isCompleted) => {
	circle.classList.toggle("checked", isCompleted);
	circle.classList.toggle("green", !isCompleted);
};

const renderTask = (task, todoList, completedList, saveTasks) => {
	const li = document.createElement("li");
	li.className = `todo-item ${task.completed ? "completed" : ""}`;

	const container = document.createElement("div");
	container.className = "todo-container";

	const circle = document.createElement("div");
	circle.className = `todo-circle ${task.completed ? "checked" : "green"}`;
	circle.addEventListener("click", () =>
		toggleTaskCompletion(li, task, todoList, completedList, saveTasks),
	);

	const title = document.createElement("div");
	title.className = "todo-title";
	const h3 = document.createElement("h3");
	h3.textContent = task.title;
	title.appendChild(h3);

	const actions = document.createElement("div");
	actions.className = "actions";

	const deleteButton = document.createElement("button");
	deleteButton.className = "action delete";
	deleteButton.innerHTML =
		'<img src="https://unpkg.com/lucide-static@latest/icons/trash.svg" />';
	deleteButton.addEventListener("click", () => deleteTask(li, saveTasks));

	actions.appendChild(deleteButton);
	container.appendChild(circle);
	container.appendChild(title);
	li.appendChild(container);
	li.appendChild(actions);

	if (task.completed) {
		completedList.appendChild(li);
	} else {
		todoList.appendChild(li);
	}
};

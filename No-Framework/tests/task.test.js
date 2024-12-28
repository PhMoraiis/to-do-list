const { addTask, toggleTaskCompletion, deleteTask } = require("../task");

describe("Task Management", () => {
	let todoList;
	let completedList;
	let tasks;
	let saveTasks;

	beforeEach(() => {
		todoList = document.createElement("ul");
		completedList = document.createElement("ul");
		tasks = [];

		// Create saveTasks implementation that updates localStorage
		saveTasks = jest.fn(() => {
			global.localStorage.setItem("tasks", JSON.stringify(tasks));
		});

		// Create a mock implementation for localStorage
		const localStorageMock = (() => {
			let store = {};
			return {
				getItem: jest.fn((key) => store[key] || null),
				setItem: jest.fn((key, value) => {
					store[key] = value;
				}),
				removeItem: jest.fn((key) => {
					delete store[key];
				}),
				clear: jest.fn(() => {
					store = {};
				}),
			};
		})();

		// Assign the mock to global.localStorage
		Object.defineProperty(global, "localStorage", {
			value: localStorageMock,
			writable: true,
		});

		document.body.appendChild(todoList);
		document.body.appendChild(completedList);
	});

	afterEach(() => {
		todoList.innerHTML = "";
		completedList.innerHTML = "";
		jest.clearAllMocks();
		tasks = [];
	});

	it("addTask should add a new task to the todo list and update localStorage", () => {
		const taskTitle = "New Task";

		// Update tasks array when adding a task
		const mockSaveTasks = jest.fn(() => {
			tasks.push({ title: taskTitle, completed: false });
			global.localStorage.setItem("tasks", JSON.stringify(tasks));
		});

		addTask(taskTitle, todoList, completedList, mockSaveTasks);

		expect(global.localStorage.setItem).toHaveBeenCalledWith(
			"tasks",
			JSON.stringify([{ title: "New Task", completed: false }]),
		);

		expect(mockSaveTasks).toHaveBeenCalled();
	});

	test("toggleTaskCompletion should move task between lists and update localStorage", () => {
		const task = { title: "New Task", completed: false };
		tasks.push(task);

		addTask(task.title, todoList, completedList, saveTasks);

		const taskItems = todoList.querySelectorAll(".todo-item");
		const taskItem = taskItems[0];

		// Update task completion status when toggling
		const mockSaveTasks = jest.fn(() => {
			tasks[0].completed = true;
			global.localStorage.setItem("tasks", JSON.stringify(tasks));
		});

		toggleTaskCompletion(
			taskItem,
			task,
			todoList,
			completedList,
			mockSaveTasks,
		);

		expect(todoList.contains(taskItem)).toBe(false);
		expect(completedList.contains(taskItem)).toBe(true);

		expect(global.localStorage.setItem).toHaveBeenCalledWith(
			"tasks",
			JSON.stringify([{ title: "New Task", completed: true }]),
		);
	});

	test("deleteTask should remove the task and update localStorage", () => {
		const task = { title: "Task to delete", completed: false };
		tasks.push(task);

		addTask(task.title, todoList, completedList, saveTasks);

		const taskItems = todoList.querySelectorAll(".todo-item");
		const taskItem = taskItems[0];

		// Update tasks array when deleting a task
		const mockSaveTasks = jest.fn(() => {
			tasks = tasks.filter((t) => t.title !== task.title);
			global.localStorage.setItem("tasks", JSON.stringify(tasks));
		});

		deleteTask(taskItem, mockSaveTasks);

		expect(todoList.contains(taskItem)).toBe(false);
		expect(mockSaveTasks).toHaveBeenCalled();

		expect(global.localStorage.setItem).toHaveBeenCalledWith(
			"tasks",
			JSON.stringify([]),
		);
	});
});
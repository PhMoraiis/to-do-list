const { addTask, toggleTaskCompletion, deleteTask } = require("../task");

describe("Gerenciamento de tarefas na todo list", () => {
	let todoList;
	let completedList;
	let tasks;
	let saveTasks;

	beforeEach(() => {
		todoList = document.createElement("ul");
		completedList = document.createElement("ul");
		tasks = [];

		// Cria a função saveTasks que atualiza o localStorage
		saveTasks = jest.fn(() => {
			global.localStorage.setItem("tasks", JSON.stringify(tasks));
		});

		// Cria uma implementação de Mock para o localStorage
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

		// Mock global do localStorage
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

	it("Adiciona uma nova tarefa á Todo List e verifica a atualização do localStorage", () => {
		const taskTitle = "New Task";

		// Atualiza o array de tarefas quando adiciona uma nova tarefa
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

	test("Move as tarefas entre as listas e atualiza o localStorage", () => {
		const task = { title: "New Task", completed: false };
		tasks.push(task);

		addTask(task.title, todoList, completedList, saveTasks);

		const taskItems = todoList.querySelectorAll(".todo-item");
		const taskItem = taskItems[0];

		// Atualiza o status de complete da tarefa quando muda o estado
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

	test("Remove a tarefa e atualiza o localStorage", () => {
		const task = { title: "Task to delete", completed: false };
		tasks.push(task);

		addTask(task.title, todoList, completedList, saveTasks);

		const taskItems = todoList.querySelectorAll(".todo-item");
		const taskItem = taskItems[0];

		// Atualizando o array de tarefas quando deleta uma tarefa
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
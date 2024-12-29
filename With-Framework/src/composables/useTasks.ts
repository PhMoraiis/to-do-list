import { ref } from "vue";
import type { ITask } from "@/types/tasks";

const tasks = ref<ITask[]>([]);
const completedTasks = ref<ITask[]>([]);

// Salva as tarefas no localStorage
const saveTasks = () => {
	localStorage.setItem("tasks", JSON.stringify(tasks.value));
	localStorage.setItem("completedTasks", JSON.stringify(completedTasks.value));
};

// Carrega as tarefas do localStorage
const loadTasks = () => {
	const storedTasks = localStorage.getItem("tasks");
	const storedCompletedTasks = localStorage.getItem("completedTasks");

	// Se já existem tarefas salvas, carrega do localStorage
	tasks.value = storedTasks ? JSON.parse(storedTasks) : [];
	completedTasks.value = storedCompletedTasks
		? JSON.parse(storedCompletedTasks)
		: [];
};

// Adiciona uma nova tarefa
const addTask = (title: string) => {
	tasks.value.push({ title, completed: false });
	saveTasks();
};

// Atualiza o status de uma tarefa (marcar como concluída ou reverter)
const updateTaskStatus = (taskIndex: number, completed: boolean) => {
	let task: ITask;

	// Se a tarefa está sendo movida de concluída para pendente
	if (completed) {
		task = tasks.value.splice(taskIndex, 1)[0]; // Remove da lista de pendentes
		task.completed = true;
		completedTasks.value.push(task); // Adiciona à lista de concluídas
	} else {
		task = completedTasks.value.splice(taskIndex, 1)[0]; // Remove da lista de concluídas
		task.completed = false;
		tasks.value.push(task); // Adiciona de volta à lista de pendentes
	}

	saveTasks();
};

// Deleta uma tarefa
const deleteTask = (taskIndex: number, isCompleted: boolean) => {
	const list = isCompleted ? completedTasks : tasks;
	list.value.splice(taskIndex, 1);
	saveTasks();
};

// Carregar as tarefas no início
loadTasks();

export function useTasks() {
	return {
		tasks,
		completedTasks,
		addTask,
		updateTaskStatus,
		deleteTask,
		saveTasks,
	};
}

import type { ITask } from "@/types/tasks";
import { useTasks } from "./useTasks";

const { addTask } = useTasks();

// Busca as tarefas sugeridas na API e adiciona em cache e filtra uma tarefa aleatória
export const fetchSuggestedTask = async () => {
	try {
		let tasks = JSON.parse(localStorage.getItem("tasksCache") || "null");

		if (!tasks) {
			const response = await fetch(
				"https://jsonplaceholder.typicode.com/todos",
			);
			tasks = await response.json();
			localStorage.setItem("tasksCache", JSON.stringify(tasks));
		}

		const validTasks = tasks.filter((task: ITask) => !task.completed);

		if (validTasks.length > 0) {
			const randomTask =
				validTasks[Math.floor(Math.random() * validTasks.length)];
			addTask(randomTask.title);
		} else {
			alert("Nenhuma tarefa disponível no momento.");
		}
	} catch (error) {
		console.error("Erro ao buscar sugestão de tarefa:", error);
	}
};

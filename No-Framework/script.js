document.addEventListener("DOMContentLoaded", () => {
	const taskInput = document.getElementById("taskInput");
	const todoList = document.querySelector(".todo-list ul");
	const completedList = document.querySelector(".completed-list ul");

	// Carrega as tasks para o LocalStorage
	const loadTasks = () => {
		// Realiza o parse das tasks para JSON, se houver tasks, se não carrega como um array vazio
		const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
		// Comentário para ignorar o forEach do Lint
		// biome-ignore lint/complexity/noForEach: <explanation>
		tasks.forEach((task) => renderTask(task));
		// Para cada task, inicia a função de renderizar a task.
	};

	// Salva as tasks no LocalStorage
	const saveTasks = () => {
		const todoList = document.getElementById("tasksList");
		const completedList = document.getElementById("completedTasksList");
		// Pega as listas

		if (!todoList || !completedList) return;
		// Verifica se os elementos existem

		const tasks = Array.from(todoList.children).map((li) => ({
			title: li.querySelector("h3").textContent,
			// Cria um h3 com o titulo da task
			completed: false,
		}));
		// Mapeia as tasks da lista de Todo's

		const completedTasks = Array.from(completedList.children).map((li) => ({
			title: li.querySelector("h3").textContent,
			// Cria um h3 com o titulo da task
			completed: true,
		}));
		// Mapeia as tasks da lista de Completadas

		localStorage.setItem(
			"tasks",
			JSON.stringify([...tasks, ...completedTasks]),
		);
		// Salva as tasks no LocalStorage passando um JSON para string com todas as tasks, tanto as completadas quanto as não completadas
	};

  // Deleta uma task e atualiza o LocalStorage
	const deleteTask = (li) => {
		li.remove();
		saveTasks();
	};
});

// Funções para abrir e fechar o modal
function openModal() {
	document.getElementById("taskModal").style.display = "block";
}

function closeModal() {
	document.getElementById("taskModal").style.display = "none";
}

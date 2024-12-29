// Aguarda o carregamento do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
	// Elementos principais do DOM
	const taskInput = document.getElementById("taskInput");
	const todoList = document.querySelector(".todo-list ul");
	const completedList = document.querySelector(".completed-list ul");

	// Função para carregar as tarefas do localStorage
	const loadTasks = () => {
		const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Busca as tarefas ou inicializa como um array vazio
		// biome-ignore lint/complexity/noForEach: <explanation>
		tasks.forEach((task) => renderTask(task)); // Renderiza cada tarefa na lista apropriada
	};

	// Função para salvar as tarefas no localStorage
	const saveTasks = () => {
		// Mapeia as tarefas da lista de Todo's
		const tasks = Array.from(todoList.children).map((li) => ({
			title: li.querySelector("h3").textContent,
			completed: false,
		}));

		// Mapeia as tarefas da lista de Concluídas
		const completedTasks = Array.from(completedList.children).map((li) => ({
			title: li.querySelector("h3").textContent,
			completed: true,
		}));

		// Salva ambas as listas no localStorage
		localStorage.setItem(
			"tasks",
			JSON.stringify([...tasks, ...completedTasks]),
		);
	};

	// Função para renderizar uma tarefa na interface
	const renderTask = (task) => {
		// Cria elementos HTML para a tarefa
		const li = document.createElement("li");
		li.className = `todo-item ${task.completed ? "completed" : ""}`;

		const container = document.createElement("div");
		container.className = "todo-container";

		// Ícone de círculo que indica status de conclusão
		const circle = document.createElement("div");
		circle.className = `todo-circle ${task.completed ? "checked" : "green"}`;
		circle.addEventListener("click", () => toggleTaskCompletion(li, task)); // Evento para alternar status de conclusão

		// Adiciona o título da tarefa
		const title = document.createElement("div");
		title.className = "todo-title";
		const h3 = document.createElement("h3");
		h3.textContent = task.title;
		title.appendChild(h3);

		// Adiciona botão de deletar
		const actions = document.createElement("div");
		actions.className = "actions";
		const deleteButton = document.createElement("button");
		deleteButton.className = "action delete";
		deleteButton.innerHTML =
			'<img src="https://unpkg.com/lucide-static@latest/icons/trash.svg" />';
		deleteButton.addEventListener("click", () => deleteTask(li)); // Evento para deletar a tarefa

		actions.appendChild(deleteButton);
		container.appendChild(circle);
		container.appendChild(title);
		li.appendChild(container);
		li.appendChild(actions);

		// Adiciona o item à lista apropriada (Todo's ou Concluídas)
		if (task.completed) {
			completedList.appendChild(li);
		} else {
			todoList.appendChild(li);
		}
	};

	// Função para adicionar uma nova tarefa
	window.addTask = function addTask(title) {
		if (!title || !title.trim()) return;
		const task = { title, completed: false };
		renderTask(task);
		saveTasks();
	};

	// Função para alternar as classes de uma tarefa (concluída ou não)
	function toggleTaskClasses(circle, isCompleted) {
		circle.classList.toggle("checked", isCompleted);
		circle.classList.toggle("green", !isCompleted);
	}

	// Função para alternar o status de conclusão de uma tarefa
	const toggleTaskCompletion = (li, task) => {
		const circle = li.querySelector(".todo-circle");
		li.classList.toggle("completed");

		// Atualiza as classes visuais do círculo
		toggleTaskClasses(circle, li.classList.contains("completed"));

		// Move a tarefa para a lista correta Todo's ou Concluídas
		const targetList = li.classList.contains("completed")
			? completedList
			: todoList;
		targetList.appendChild(li);

		saveTasks();
	};

	// Função para deletar uma tarefa
	const deleteTask = (li) => {
		li.remove();
		saveTasks();
	};

	// Função para buscar uma tarefa sugerida da API
	const fetchSuggestedTask = async () => {
		try {
			// Tenta carregar as tarefas do LocalStorage
			let tasks = JSON.parse(localStorage.getItem("tasksCache"));

			// Se não houver nenhuma tarefa, busca as tarefas da API
			if (!tasks) {
				const response = await fetch(
					"https://jsonplaceholder.typicode.com/todos",
				);
				tasks = await response.json();

				// Armazena as tarefas no LocalStorage para uso futuro
				localStorage.setItem("tasksCache", JSON.stringify(tasks));
			}

			// Filtra tarefas não concluídas
			const validTasks = tasks.filter((task) => !task.completed);

			// Adiciona uma tarefa aleatória, se disponível
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

	// Adiciona eventos aos botões de criar e sugerir tarefas
	document.querySelector(".create-btn.add").addEventListener("click", () => {
		addTask(taskInput.value);
		taskInput.value = "";
		closeModal();
	});

	document.querySelector(".suggest-btn").addEventListener("click", () => {
		fetchSuggestedTask();
	});

	loadTasks(); // Carrega as tarefas ao iniciar
});

// Funções para abrir e fechar o modal
function openModal() {
	document.getElementById("taskModal").style.display = "block";
}

function closeModal() {
	document.getElementById("taskModal").style.display = "none";
}

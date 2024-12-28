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
	};

	// Salva as tasks no LocalStorage
	const saveTasks = () => {
		const todoList = document.getElementById("tasksList");
		const completedList = document.getElementById("completedTasksList");

		if (!todoList || !completedList) return;

		const tasks = Array.from(todoList.children).map((li) => ({
			title: li.querySelector("h3").textContent,
			completed: false,
		}));
		// Mapeia as tasks da lista de Todo's

		const completedTasks = Array.from(completedList.children).map((li) => ({
			title: li.querySelector("h3").textContent,
			completed: true,
		}));
		// Mapeia as tasks da lista de Completadas

		localStorage.setItem(
			"tasks",
			JSON.stringify([...tasks, ...completedTasks]),
		);
		// Salva as tasks no LocalStorage passando um JSON para string com todas as tasks, tanto as completadas quanto as não completadas
	};

	// Renderiza as tasks presentes na loadTask()
	const renderTask = (task) => {
		const li = document.createElement("li");
		li.className = `todo-item ${task.completed ? "completed" : ""}`;

		const container = document.createElement("div");
		container.className = "todo-container";

		const circle = document.createElement("div");
		circle.className = `todo-circle ${task.completed ? "checked" : "green"}`;
		circle.addEventListener("click", () => toggleTaskCompletion(li, task));

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
		deleteButton.addEventListener("click", () => deleteTask(li));

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

	// Adiciona uma nova task vinda do input e salva no LocalStorage
	window.addTask = function addTask() {
		const taskInput = document.getElementById("taskInput");
		const tasksList = document.getElementById("tasksList");
		const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

		if (taskInput.value.trim() === "") return;

		const newTask = {
			title: taskInput.value,
			completed: false,
		};

		tasks.push(newTask);
		localStorage.setItem("tasks", JSON.stringify(tasks));

		const taskItem = document.createElement("li");
		taskItem.className = "todo-item";
		taskItem.innerHTML = `<h3>${newTask.title}</h3>`;
		tasksList.appendChild(taskItem);

		taskInput.value = "";
	};

	// Inicia a função de completar as tasks
	function toggleTaskClasses(circle, isCompleted) {
		circle.classList.toggle("checked", isCompleted);
		circle.classList.toggle("green", !isCompleted);
	}

	// Função para completar uma task e atualizar o LocalStorage
	const toggleTaskCompletion = (li, task) => {
		const circle = li.querySelector(".todo-circle");
		li.classList.toggle("completed");

		// Atualiza as classes do círculo
		toggleTaskClasses(circle, li.classList.contains("completed"));

		const targetList = li.classList.contains("completed")
			? completedList
			: todoList;
		targetList.appendChild(li);
		saveTasks();
	};

	// Deleta uma task e atualiza o LocalStorage
	const deleteTask = (li) => {
		li.remove();
		saveTasks();
	};

	// Função para adicionar uma task de sugestão, ela faz uma requisição para a API, adiciona todas as tasks ao LocalStorage e depois filtra as tasks não completadas em um array e seleciona uma task aleatória para adicionar
	const fetchSuggestedTask = async () => {
		try {
			let tasks = JSON.parse(localStorage.getItem("tasksCache")) || [];

			if (tasks.length === 0) {
				const response = await fetch(
					"https://jsonplaceholder.typicode.com/todos",
				);
				if (!response.ok) throw new Error("Erro na requisição da API");
				tasks = await response.json();
				localStorage.setItem("tasksCache", JSON.stringify(tasks));
			}

			const validTasks = tasks.filter((task) => !task.completed);

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

	// Seleciona o botão de adicionar task e adiciona um evento de click
	const createButton = document.querySelector(
		".create-btn[onclick='addTask()']",
	);
	if (createButton) {
		createButton.addEventListener("click", () => {
			addTask(taskInput.value);
			taskInput.value = "";
			closeModal();
		});

    // Seleciona o botão de sugestão de task e adiciona um evento de click
		const suggestButton = document.querySelector(
			".create-btn[onclick='fetchSuggestedTask()']",
		);
		if (suggestButton) {
			suggestButton.addEventListener("click", fetchSuggestedTask);
		} else {
			console.error("Botão de sugestão não encontrado.");
		}
	} else {
		console.error("Botão de criação não encontrado.");
	}

	// Carrega as tasks ao iniciar a página
	loadTasks();
});

// Funções para abrir e fechar o modal
function openModal() {
	document.getElementById("taskModal").style.display = "block";
}

function closeModal() {
	document.getElementById("taskModal").style.display = "none";
}

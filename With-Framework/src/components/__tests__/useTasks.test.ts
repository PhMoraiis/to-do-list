import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TodoList from "@/components/TodoList/TodoList.vue";
import { useTasks } from "@/composables/useTasks";

// Mock completo do localStorage
const localStorageMock: Storage = {
	length: 0,
	clear: vi.fn(),
	getItem: vi.fn(),
	key: vi.fn(),
	removeItem: vi.fn(),
	setItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

describe("Adicionando uma nova tarefa", () => {
	it("deve adicionar uma nova tarefa à lista de tarefas e verificar o localStorage", async () => {
		const { tasks, addTask } = useTasks();
		const wrapper = mount(TodoList);

		// Adiciona uma tarefa usando a função addTask
		addTask("Tarefa de Teste");

		// Verifica se a tarefa foi adicionada à lista de tarefas
		expect(tasks.value).toHaveLength(1);
		expect(tasks.value[0].title).toBe("Tarefa de Teste");

		// Verifica se o localStorage foi atualizado
		expect(localStorage.setItem).toHaveBeenCalledWith(
			"tasks",
			expect.any(String),
		);
	});
});

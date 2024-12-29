<script setup lang="ts">
import { Trash } from "lucide-vue-next";
import Button from "../ui/button/Button.vue";
import { useTasks } from "@/composables/useTasks";

const { completedTasks, saveTasks, updateTaskStatus } = useTasks();

// Função para desmarcar uma tarefa como concluída
const uncompleteTask = (taskIndex: number) => {
  updateTaskStatus(taskIndex, false);
};

// Função para deletar uma tarefa concluída
const deleteCompletedTask = (taskIndex: number) => {
  completedTasks.value.splice(taskIndex, 1); // Remove da lista de completadas
  saveTasks();
};
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-xl text-primary font-semibold">Finalizadas</h2>
    <ul>
      <li 
        v-for="(task, index) in completedTasks" 
        :key="index" 
        class="flex items-center justify-between p-4 border border-border rounded-md mb-3"
      >
        <div class="flex">
          <div 
            class="circle check" 
            @click="uncompleteTask(index)"
          ></div>
          <div class="flex-1">
            <h3 
              class="text-md font-medium text-[#999999] line-through decoration-green"
            >
              {{ task.title }}
            </h3>
          </div>
        </div>
        <div>
          <Button 
            variant="outline" 
            class="hover:bg-destructive duration-300 ease-out" 
            size="icon" 
            @click="deleteCompletedTask(index)"
          >
            <Trash />
          </Button>
        </div>
      </li>
    </ul>
  </section>
</template>

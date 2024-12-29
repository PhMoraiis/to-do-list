<script setup lang="ts">
import { Trash } from "lucide-vue-next";
import Button from "../ui/button/Button.vue";
import { useTasks } from "@/composables/useTasks";

const { tasks, saveTasks, updateTaskStatus } = useTasks(); 

// Função para concluir uma tarefa
const completeTask = (taskIndex: number) => {
  updateTaskStatus(taskIndex, true);
};

// Função para deletar uma tarefa pendente
const deleteTask = (taskIndex: number) => {
  tasks.value.splice(taskIndex, 1); // Remove da lista de pendentes
  saveTasks();
};
</script>

<template>
  <section class="flex flex-col gap-4">
    <ul>
      <li 
        v-for="(task, index) in tasks" 
        :key="index" 
        class="flex items-center justify-between p-4 border border-border rounded-md mb-3"
      >
        <div class="flex">
          <div 
            class="circle" 
            @click="completeTask(index)"
          ></div>
          <div class="flex-1">
            <h3 class="text-md font-medium">{{ task.title }}</h3>
          </div>
        </div>
        <div>
          <Button 
            variant="outline" 
            class="hover:bg-destructive duration-300 ease-out" 
            size="icon" 
            @click="deleteTask(index)"
          >
            <Trash />
          </Button>
        </div>
      </li>
    </ul>
  </section>
</template>

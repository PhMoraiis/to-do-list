<script setup lang="ts">
import Modal from "./components/Modal/Modal.vue";
import TodoList from "./components/TodoList/TodoList.vue";
import CompleteList from "./components/CompleteList/CompleteList.vue";

import { Button } from "@/components/ui/button"
import { fetchSuggestedTask } from "./composables/suggestedTasks";
</script>

<template>
 <main class="w-screen max-w-3xl bg-zinc-50 rounded-xl p-8 shadow-md font-normal">
  <header class="flex justify-between items-center mb-8">
    <h2 class="text-2xl text-primary font-semibold">Todo</h2>
    <div class="flex gap-3">
      <Modal />
      <Button @click="fetchSuggestedTask()">Sugerir Tarefa</Button>
    </div>
  </header>
  <TodoList />
  <CompleteList />
 </main>
</template>


<script setup lang="ts">
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { ref } from "vue";
import { useTasks } from "@/composables/useTasks";

const { addTask } = useTasks();

const newTaskTitle = ref("");

// Cria uma nova tarefa
const handleCreateTask = () => {
	if (newTaskTitle.value.trim() !== "") {
		addTask(newTaskTitle.value.trim());
		newTaskTitle.value = "";
	}
};
</script>

<template>
 <Dialog>
    <DialogTrigger as-child>
      <Button>Nova Tarefa</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nova tarefa</DialogTitle>
      </DialogHeader>
      <div class="flex items-start py-4">
        <div class="flex w-full items-center gap-4">
          <Label for="taskTitle" class="text-right font-medium">Título:</Label>
          <Input
            id="taskTitle"
            v-model="newTaskTitle"
            placeholder="Digite aqui sua tarefa"
            class="col-span-4 w-full"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button @click="handleCreateTask">Criar tarefa</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
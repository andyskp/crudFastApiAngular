import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService, Task } from '../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  tasks: Task[] = [];
  newTitle = '';
  newDescription = '';
  error: string | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.todoService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.error = null;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error cargando las tareas';
      }
    });
  }

  createTask(): void {
    if (!this.newTitle || !this.newDescription) {
      this.error = 'Título y descripción son requeridos';
      return;
    }
    this.todoService.createTask({ title: this.newTitle, description: this.newDescription }).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTitle = '';
        this.newDescription = '';
        this.error = null;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error creando la tarea';
      }
    });
  }

  updateTask(task: Task): void {
    this.todoService.updateTask(task.id, { title: task.title, description: task.description }).subscribe({
      next: () => {
        this.error = null;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error actualizando la tarea';
      }
    });
  }

  deleteTask(taskId: number): void {
    this.todoService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.error = null;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error eliminando la tarea';
      }
    });
  }
}

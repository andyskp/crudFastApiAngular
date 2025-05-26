import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // URL local 
  private apiUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) {}

private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });
}

  // Peticiones HTTP para las tareas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { headers: this.getHeaders() });
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task, { headers: this.getHeaders() });
  }

  updateTask(taskId: number, task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, task, { headers: this.getHeaders() });
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}`, { headers: this.getHeaders() });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../_services/todo.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { User } from '../_models/user.model';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent {

  todo = { title: '', description: '', due_date: ''}
  isLoading = false;
  message = '';

  isLoadingFetch = false;
  messageFetch = '';
  todos: any[] = [];

  today = new Date();
  minDate = this.today.toISOString().split('T')[0];



  token = document.cookie
  .split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1];
  
  decoded: any = jwtDecode(this.token!);
  
  user: User = {
    id: this.decoded.id,
    name: this.decoded.name,
    email: this.decoded.email,
    created_at: '',
    updated_at: ''
  }
  
  
  constructor(private todoService: TodoService,  private router: Router, private authService: AuthService,) {}
  
  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.getTodos();
    }
  }


  addTodo() {
    this.isLoading = true;
    this.todoService.addTodo(this.todo).subscribe({
      next: () => {
        this.getTodos()
        this.isLoading = false;
        this.message = 'Added succesfully!';
        setTimeout(() => { 
          this.todo = { title: '', description: '', due_date: '' };
        })
      },
      error: (err) => {
        console.error('Erreur POST', err)
        this.isLoading = false;
          this.message = err.error.message;
      }
    });
  }


  getTodos() {
    this.isLoadingFetch = true;
    this.todoService.getTodos().subscribe({
      next: (data) => {
        this.isLoadingFetch = false;
        this.todos = data;
      },
      error: (err) => {
        console.error('Erreur GET', err);
        this.isLoadingFetch = false;
        this.messageFetch = err.error.message;
      }
    });
  }
}

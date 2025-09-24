import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CategoriesResponse, CategoryRequest } from '../interfaces/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/Categories`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<CategoriesResponse>(this.apiUrl).pipe(
      map(response => response.categories || [])
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(data: CategoryRequest): Observable<Category> {
    const requestBody = { category: data.name, hexColor: data.hexColor };
    return this.http.post<Category>(this.apiUrl, requestBody);
  }

  updateCategory(id: number, data: CategoryRequest): Observable<void> {
    const requestBody = { category: data.name, hexColor: data.hexColor };
    return this.http.put<void>(`${this.apiUrl}/${id}`, requestBody);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

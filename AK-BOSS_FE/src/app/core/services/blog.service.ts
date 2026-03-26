import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  createBlog(formData: FormData) {
    return this.http.post(`${this.baseUrl}/api/blog/create`, formData);
  }

  getBlogs() {
    return this.http.get(`${this.baseUrl}/all`);
  }

  getBlogById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
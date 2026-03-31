import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
export interface BlogResponse {
  message: string;
  blogId: number;
  slug?: string;
}
@Injectable({
  providedIn: 'root'
})

export class BlogService {

  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {}

  createBlog(formData: FormData) {
    return this.http.post<BlogResponse>(`${this.baseUrl}/api/blog/create`, formData);
  }

  getBlogs() {
    return this.http.get<BlogResponse[]>(`${this.baseUrl}/all`);
  }

  getBlogById(id: number) {
    return this.http.get<BlogResponse>(`${this.baseUrl}/${id}`);
  }
}
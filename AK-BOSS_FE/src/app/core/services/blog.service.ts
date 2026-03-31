import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
export interface BlogResponse {
  message: string;
  blogId: number;
  slug?: string;
}

export interface BlogListResponse {
  message: string;
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

getBlogs(params: any) {
  return this.http.get<BlogListResponse>(`${this.baseUrl}/api/blog/list`, { params });
}

  getBlogById(id: number) {
    return this.http.get<BlogResponse>(`${this.baseUrl}/${id}`);
  }
}
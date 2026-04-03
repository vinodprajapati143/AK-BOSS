import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

 export class SettingService {
private http = inject(HttpClient);
private baseUrl = environment.apiUrl;

 uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/api/upload`, formData);
  }

    // 🔥 GET SETTINGS
  getSettings() {
    return this.http.get(`${this.baseUrl}/api/admin/settings`);
  }

  // 🔥 UPDATE SETTINGS
  updateSettings(data: any) {
    return this.http.put(`${this.baseUrl}/api/admin/settings`, data);
  }

 }
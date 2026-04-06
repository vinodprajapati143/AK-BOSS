import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})

 export class SettingService {
private http = inject(HttpClient);
private baseUrl = environment.apiUrl;

private settings$ = new BehaviorSubject<any>(null);
 uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/api/upload`, formData);
  }

    // 🔥 GET SETTINGS
  getSettingsFromApi() {
    return this.http.get(`${this.baseUrl}/api/admin/settings`);
  }

    loadSettings() {
    if (!this.settings$.value) {
      this.getSettingsFromApi().subscribe((res: any) => {
        this.settings$.next(res.data);
      });
    }
  }

    getSettings() {
    return this.settings$.asObservable();
  }

  // 🔥 UPDATE SETTINGS
  updateSettings(data: any) {
    return this.http.put(`${this.baseUrl}/api/admin/settings`, data);
  }

 }
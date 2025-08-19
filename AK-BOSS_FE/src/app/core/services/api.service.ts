import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { LoginResponse } from '../module/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
   private baseUrl = environment.apiUrl;

constructor(private http: HttpClient) {}

 register(data: any) {
   return this.http.post(`${this.baseUrl}/api/auth/register`, data,{ withCredentials: true });
  }
  login(data:any): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, data,{ withCredentials: true });

  }

  logout(data:any){
    return this.http.post(`${this.baseUrl}/api/auth/logout`, data,{ withCredentials: true })
  }

  sendotp(data:any){
    return this.http.post(`${this.baseUrl}/api/auth/send-forgot-otp`, data,{ withCredentials: true })

  }
    resetPass(data:any){
    return this.http.post(`${this.baseUrl}/api/auth/reset-password`, data,{ withCredentials: true })

  }
}

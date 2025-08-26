import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, timer } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { LoginResponse } from '../module/login-response.model';
import { Game } from '../module/models';

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

  addGame(gameData: any) {
   return this.http.post(`${this.baseUrl}/api/games/add-game`, gameData,{ withCredentials: true });
  }
  getGames() {
   return this.http.get(`${this.baseUrl}/api/games/game-list`,{ withCredentials: true });
  }
  getUsers() {
   return this.http.get(`${this.baseUrl}/api/users/user-list`,{ withCredentials: true });
  }

  getNearestGames(): Observable<Game[]> {
    return timer(0, 30_000).pipe(
      switchMap(() => this.http.get<{success:boolean,data: Game[]}>(`${this.baseUrl}/api/games/nearest-game-list`,{ withCredentials: true })),
      switchMap(res => [res.data])
    );
  }
  
  saveGameInput(gameData: any) {
   return this.http.post(`${this.baseUrl}/api/games/save-game-input`, gameData,{ withCredentials: true });
  }
}

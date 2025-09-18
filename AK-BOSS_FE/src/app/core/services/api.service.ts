import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, timer } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { LoginResponse } from '../module/login-response.model';
import { Game, gamebyid, JodiRecord, JodiResponse, PanelResponse, UserGame } from '../module/models';

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

    // Get game by ID
  getGameById(id: string): Observable<{success: boolean, game: gamebyid}> {
    return this.http.get<{success: boolean, game: gamebyid}>(`${this.baseUrl}/api/games/${id}`);
  }

    // Update game by ID
  updateGame(id: string, gameData: Game): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.baseUrl}/api/games/${id}`, gameData);
  }


  getGames() {
   return this.http.get(`${this.baseUrl}/api/games/game-list`,{ withCredentials: true });
  }
  getUsers() {
   return this.http.get(`${this.baseUrl}/api/users/user-list`,{ withCredentials: true });
  }

  getNearestGames(): Observable<any> {
    return timer(0, 30_000).pipe(
      switchMap(() => this.http.get<any>(`${this.baseUrl}/api/games/nearest-game-list`,{ withCredentials: true })),
      switchMap(res => [res])
    );
  }

getpublicGames(): Observable<any> {
  return timer(0, 30000).pipe(
    switchMap(() => this.http.get<any>(`${this.baseUrl}/api/games/public-game-list`))
  );
}

 

getUserGames(): Observable<{ success: boolean; data: UserGame[] }> {
    return timer(0, 30000).pipe(
    switchMap(() => this.http.get<{ success: boolean; data: UserGame[] }>(`${this.baseUrl}/api/games/user-game-list`))
  );
}

getpublicGamesResult(): Observable<any> {
  return timer(0, 30000).pipe(
    switchMap(() => this.http.get<any>(`${this.baseUrl}/api/games/public-game-result`))
  );
}
  
  saveGameInput(gameData: any) {
   return this.http.post(`${this.baseUrl}/api/games/save-game-input`, gameData,{ withCredentials: true });
  }


getJodiRecords(gameId: string, fromDate: string, toDate: string): Observable<JodiResponse> {
  const url = `${this.baseUrl}/api/games/${gameId}/jodi-records?from=${fromDate}&to=${toDate}`;
  return this.http.get<JodiResponse>(url);
}

getPanelRecords(gameId: string, fromDate: string, toDate: string): Observable<PanelResponse> {
  const url = `${this.baseUrl}/api/games/${gameId}/panel-records?from=${fromDate}&to=${toDate}`;
  return this.http.get<PanelResponse>(url);
}

getReferralCode() {
  return this.http.get(`${this.baseUrl}/api/users/referral-code`,{ withCredentials: true });
}

getReferralList() {
  return this.http.get(`${this.baseUrl}/api/users/referralList`,{ withCredentials: true });
}

getUserProfile() {
  return this.http.get(`${this.baseUrl}/api/users/profile`,{ withCredentials: true });
}


}

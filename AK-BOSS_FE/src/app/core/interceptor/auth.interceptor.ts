// error-handling.interceptor.ts

import { HttpErrorResponse, HttpResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CustomError } from '../module/models';


export const AppInterceptor: HttpInterceptorFn = (request, next) => {
  // Get the JWT token from wherever you store it (localStorage, cookies, etc.)
  const sessionStorageService = inject(StorageService);
  const jwtToken = sessionStorageService.getItem('authToken'); // Example: Retrieve from localStorage
  // Clone the request and add the Authorization header with the JWT
  const modifiedRequest = jwtToken
    ? request.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: 'application/json', // Set the Accept header to JSON format
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      },
    }) : request.clone({
      setHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    });

  return next(modifiedRequest).pipe(
    tap((response) => {
      if (response instanceof HttpResponse) {
        // Extract the JSON data and return it
        const jsonData = response.body as CustomError;
        if (jsonData && jsonData.code && jsonData.code == 200) {
          return jsonData.data;
        } else if (jsonData && jsonData.code && jsonData.code == 401) {

          // debugger
          sessionStorageService.removeItem('authToken')
          sessionStorageService.clear();
          window.location.href = window.location.origin
          return throwError(() => new CustomError(jsonData.message, jsonData.code, null));
        } else {
          return throwError(() => new CustomError(jsonData.message, jsonData.code, null));
        }
      }
      return throwError(() => new CustomError("Response format not recognized_" + response.type, 200, null));

    }),
    catchError((error: HttpErrorResponse) => {
      if (error && error.headers && !error.headers.get('content-type')?.includes('application/json')) {
        return throwError(() => new CustomError(error.statusText ?? "Response format not recognized", error.status, null));
      }

      if (error.error instanceof ErrorEvent) {
        return throwError(() => new CustomError(error.statusText ?? "Client-side error", error.status, error.error));
      } else {
        return throwError(() => new CustomError(error.statusText ?? "Server-side error", error.status, error.error));
      }
    })
  );

};





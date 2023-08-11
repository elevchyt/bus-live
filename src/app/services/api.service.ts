import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    if (window.location.host == 'localhost:4200') {
      this.baseUrl = environment.apiBaseUrl;
    } else {
      this.baseUrl = environment.apiBaseUrl;
    }
  }

  getFullUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }

  get(endpoint: string) {
    const url = this.getFullUrl(endpoint);
    return this.http.get(url);
  }
}

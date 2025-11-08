import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:4454';

  constructor(private http: HttpClient) {}

  getAllCities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/forecast`);
  }

  getCityById(cityId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cityForecast/${cityId}`);
  }
}

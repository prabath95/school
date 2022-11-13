import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../utils/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpService) {}

  getClassData(): Observable<any> {
    return this.http.get(`${environment.baseUrl}class/class`);
  }

  getClassDetails(): Observable<any> {
    return this.http.get(`${environment.baseUrl}class/classData`);
  }
}

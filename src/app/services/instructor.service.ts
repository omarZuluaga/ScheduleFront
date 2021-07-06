import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Instructor } from '../models/instructor.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private readonly endpoint: string = `${environment.api}/instructor`

  private instructor = new BehaviorSubject<Partial<Instructor>>({});

  public instructor$: Observable<Partial<Instructor>> = this.instructor.asObservable();

  constructor(private http: HttpClient) { }

  setInstructor(instructor: Instructor): void {
    this.instructor.next(instructor);
  }

  getInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(this.endpoint);
  }

  getInstructorById(instructorId: number): Observable<Instructor> {
    return this.http.get<Instructor>(`${this.endpoint}/${instructorId}`);
  }

  createInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.post<Instructor>(this.endpoint, instructor);
  }

  editInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.put<Instructor>(`${this.endpoint}/${instructor.id}`, instructor);
  }

  deleteInstructor(instructor: Instructor): Observable<Instructor> {
    return this.http.delete<Instructor>(`${this.endpoint}/${instructor.id}`);
  }

}

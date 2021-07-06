import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from '../models/event.model';
import { Instructor } from '../models/instructor.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly endpoint: string = `${environment.api}/instructor`

  constructor(private http: HttpClient) { }

  getEvents(instructor: Instructor): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.endpoint}/${instructor.id}/events`);
  }

  createEvent(event: Event, instructor: Instructor): Observable<Event> {
    return this.http.post<Event>(`${this.endpoint}/${instructor.id}/events`, event);
  }

  editEvent(event: Event, instructor: Instructor): Observable<Event> {
    return this.http.put<Event>(`${this.endpoint}/${instructor.id}/events/${event.id}`, event);
  }

  deleteEvent(event: Event, instructor: Instructor): Observable<Event> {
    return this.http.delete<Event>(`${this.endpoint}/${instructor.id}/events/${event.id}`);
  }

}

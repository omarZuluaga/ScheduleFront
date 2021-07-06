import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Event } from 'src/app/models/event.model';

import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { Instructor } from 'src/app/models/instructor.model';
import { InstructorService } from 'src/app/services/instructor.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  @Input() instructors: Instructor[] = [];
  @Output() sendEvent: EventEmitter<{ event: string, object: Event, instructor: string, pos?: number }> = new EventEmitter();

  public subscription: Subscription = new Subscription();
  public events: CalendarEvent[] = [];
  public activeDayIsOpen: boolean = true;
  public view: CalendarView = CalendarView.Month;
  public viewDate: Date = new Date();
  public refresh: Subject<any> = new Subject();
  public selected: string = '';
  public daysEvents: number = 0;

  constructor(private service: InstructorService) { }

  ngOnInit(): void {
    this.subscription = this.service.instructor$.subscribe(
      data => {
        if (data.events && data.events.length > 0) {
          this.daysEvents = data.overallEventsDuration as number;
          this.events = data.events.map(value => {
            return {
              start: new Date(value.start),
              end: new Date(value.end),
              title: `${value.type} - Duration: ${value.daysBetween} ${value.daysBetween === 1 ? 'day' : 'days'}`
            };
          });
        } else this.events = [];
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeInstructor(event: any): void {
    this.service.getInstructorById(event).subscribe(
      data => this.service.setInstructor(data)
    );
  }

  closeOpenMonthViewDay(): void {
    this.activeDayIsOpen = false;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

}
  
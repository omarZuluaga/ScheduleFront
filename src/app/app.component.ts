import { Component, OnInit } from '@angular/core';
import { Instructor } from './models/instructor.model';
import { InstructorService } from './services/instructor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public instructors: Instructor[] = [];

  constructor(private service: InstructorService) { };

  ngOnInit(): void {
    this.service.getInstructors().subscribe(
      data => this.instructors = data
    );
  }

  eventReceiver(event: any): void {
    if (event.event === 'create') {
      this.service.createInstructor(event.instructor).subscribe(
        data => this.instructors.push(data)
      );
    } else if (event.event === 'edit') {
      this.service.editInstructor(event.instructor).subscribe(
        () => {
          this.instructors[event.index] = event.instructor
        }
      )
    } else {
      this.service.deleteInstructor(event.instructor).subscribe(
        () => {
          const ins = this.instructors.filter(item => item.id !== event.instructor.id);
          this.instructors = ins;
        }
      );
    }
  }

}

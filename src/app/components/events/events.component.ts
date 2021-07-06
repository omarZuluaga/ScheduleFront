import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from 'src/app/models/event.model';
import { Instructor } from 'src/app/models/instructor.model';
import { EventService } from 'src/app/services/event.service';
import { InstructorService } from 'src/app/services/instructor.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  public selected!: Instructor;

  public isCreate: boolean = true;
  public form!: FormGroup;
  public trash = faTrash;
  public edit = faEdit;

  constructor(private modalService: NgbModal, private service: EventService, private provider: InstructorService) { }

  ngOnInit(): void {
    this.provider.instructor$.subscribe(
      data => this.selected = { ...data } as Instructor
    )
    this.initForm();
  }

  createModal(content: unknown): void {
    this.isCreate = true;
    this.initForm();
    this.modalService.open(content, { centered: true }).closed.subscribe(
      () => {
        const form = {
          ...this.form.value,
          start: this.parseDate(this.form.value.start),
          end: this.parseDate(this.form.value.end),
          instructorVO: this.selected
        };
        this.service.createEvent(form, this.selected).subscribe(
          data => {
            this.initForm();
            const aux = this.selected;
            aux.events.push(data);
            this.provider.setInstructor(aux);
          },
          error => {
            console.log(error);
            Swal.fire({
              title: 'An error has ocurred',
              text: error.error,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745'
            });
          }
        );
      }
    );
  }

  editModal(content: unknown, event: Event, index: number): void {
    const start = new Date(event.start).toLocaleDateString().split('/');
    const end = new Date(event.end).toLocaleDateString().split('/');
    const value = {
      ...event,
      start: { year: +start[2], month: +start[1], day: +start[0] },
      end: { year: +end[2], month: +end[1], day: +end[0] }
    };
    this.form.patchValue(value);
    this.isCreate = false;
    this.modalService.open(content, { centered: true }).closed.subscribe(
      () => {
        const form = {
          ...this.form.value,
          start: this.parseDate(this.form.value.start),
          end: this.parseDate(this.form.value.end),
          id: event.id,
          instructorVO: this.selected
        };
        this.service.editEvent(form, this.selected).subscribe(
          () => {
            this.initForm();
            const aux = this.selected;
            aux.events[index] = form;
            this.provider.setInstructor(aux);
          }
        );
      }
    );
  }

  deleteEvent(event: Event): void {
    this.service.deleteEvent(event, this.selected).subscribe(
      () => this.updateSelected()
    );
  }

  confirmDelete(event: Event): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this event',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#28a745'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteEvent(event);
      }
    });
  }

  updateSelected(): void {
    this.provider.getInstructorById(this.selected.id as number).subscribe(
      data => this.provider.setInstructor(data)
    );
  }

  parseDate(date: { year: number, month: number, day: number }): Date {
    return new Date(`${date.year}-${date.month}-${date.day}`);
  }

  initForm(): void {
    this.form = new FormGroup({
      start: new FormControl('', { validators: [Validators.required] }),
      end: new FormControl('', { validators: [Validators.required] }),
      type: new FormControl('', { validators: [Validators.required] }),
      description: new FormControl('')
    });
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Instructor } from 'src/app/models/instructor.model';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.scss']
})
export class InstructorComponent implements OnInit {

  @Input() instructors: Instructor[] = [];
  @Output() instructorEvent: EventEmitter<{ event: string, instructor: Instructor, pos?: number }> = new EventEmitter();

  public isCreate: boolean = true;
  public form!: FormGroup;
  public trash = faTrash;
  public edit = faEdit;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initForm();
  }

  parseDate(date: { year: number, month: number, day: number }): Date {
    return new Date(`${date.year}-${date.month}-${date.day}`);
  }

  createModal(content: unknown): void {
    this.isCreate = true;
    this.modalService.open(content, { centered: true }).closed.subscribe(
      () => {
        const form = { ...this.form.value, birthday: this.parseDate(this.form.value.birthday) };
        this.initForm();
        this.instructorEvent.emit({ event: 'create', instructor: form });
      }
    );
  }

  editModal(content: unknown, instructor: Instructor, index: number): void {
    const date = new Date(instructor.birthday);
    const value = { ...instructor, birthday: { year: date.getFullYear(), month: date.getMonth(), day: date.getDay() } };
    this.form.patchValue(value);
    this.isCreate = false;
    this.modalService.open(content, { centered: true }).closed.subscribe(
      () => {
        const form = { ...this.form.value, birthday: this.parseDate(this.form.value.birthday), id: instructor.id };
        this.initForm();
        this.instructorEvent.emit({ event: 'edit', instructor: form, pos: index });
      }
    );
  }

  deleteInstructor(index: number, instructor: Instructor): void {
    this.instructorEvent.emit({ event: 'delete', instructor, pos: index });
  }

  initForm(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', { validators: [Validators.required] }),
      lastName: new FormControl('', { validators: [Validators.required] }),
      birthday: new FormControl('', { validators: [Validators.required] })
    });
  }

}

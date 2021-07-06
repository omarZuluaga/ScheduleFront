import { Event } from './event.model';

export interface Instructor {
    id?: number;
    firstName: string;
    lastName: string;
    birthday: string;
    events: Event[];
    overallEventsDuration: number;
}

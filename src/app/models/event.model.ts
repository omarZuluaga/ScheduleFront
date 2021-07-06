import { Instructor } from "./instructor.model";

export interface Event {
    id?: number;
    start: Date;
    end: Date;
    type: string;
    description: string;
    instructorVO: Instructor;
    daysBetween: number;
}
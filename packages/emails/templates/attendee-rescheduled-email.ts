// Stub - attendee rescheduled email removed
import type { CalendarEvent } from "@calcom/types/Calendar";

export default class AttendeeRescheduledEmail {
  calEvent: CalendarEvent;
  attendee: unknown;

  constructor(calEvent: CalendarEvent, attendee: unknown) {
    this.calEvent = calEvent;
    this.attendee = attendee;
  }

  getFormattedDate(): string {
    return "";
  }
}

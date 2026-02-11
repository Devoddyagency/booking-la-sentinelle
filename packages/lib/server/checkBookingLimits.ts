import type { IntervalLimit } from "@calcom/types/Calendar";

export async function checkBookingLimits(
  _bookingLimits: IntervalLimit,
  _eventStartDate: Date,
  _eventId: number,
  _rescheduleUid?: string | undefined,
  _timeZone?: string | null,
  _includeManagedEvents?: boolean
) {
  return false;
}

export async function checkBookingLimit(_params: {
  eventStartDate: Date;
  eventId?: number;
  key: keyof IntervalLimit;
  limitingNumber: number | undefined;
  rescheduleUid?: string | undefined;
  timeZone?: string | null;
  teamId?: number;
  user?: { id: number; email: string };
  includeManagedEvents?: boolean;
}) {
  return;
}

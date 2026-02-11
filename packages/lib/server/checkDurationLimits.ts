import type { IntervalLimit } from "@calcom/types/Calendar";

export async function checkDurationLimits(
  _durationLimits: IntervalLimit,
  _eventStartDate: Date,
  _eventId: number,
  _rescheduleUid?: string
) {
  return false;
}

export async function checkDurationLimit(_params: {
  eventStartDate: Date;
  eventId: number;
  key: keyof IntervalLimit;
  limitingNumber: number | undefined;
  rescheduleUid?: string;
}) {
  return;
}

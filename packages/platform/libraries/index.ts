import type { TDependencyData } from "@calcom/app-store/_appRegistry";
import { getCalendar } from "@calcom/app-store/_utils/getCalendar";
import { CalendarService } from "@calcom/app-store/applecalendar/lib";
import { CalendarService as IcsFeedCalendarService } from "@calcom/app-store/ics-feedcalendar/lib";
import type { CredentialOwner } from "@calcom/app-store/types";
import { getAppFromSlug } from "@calcom/app-store/utils";
import type { CredentialDataWithTeamName, LocationOption } from "@calcom/app-store/utils";
import { getClientSecretFromPayment } from "@calcom/features/ee/payments/pages/getClientSecretFromPayment";
import { handleCreatePhoneCall } from "@calcom/features/handleCreatePhoneCall";
import getEnabledAppsFromCredentials from "@calcom/lib/apps/getEnabledAppsFromCredentials";
import { symmetricEncrypt, symmetricDecrypt } from "@calcom/lib/crypto";
import { getTranslation } from "@calcom/lib/server/i18n";
import { MembershipRole } from "@calcom/prisma/enums";
import { credentialForCalendarServiceSelect } from "@calcom/prisma/selects/credential";
import { paymentDataSelect } from "@calcom/prisma/selects/payment";
import type { TeamQuery } from "@calcom/trpc/server/routers/loggedInViewer/integrations.handler";
import {
  createNewUsersConnectToOrgIfExists,
  sendSignupToOrganizationEmail,
} from "@calcom/trpc/server/routers/viewer/teams/inviteMember/utils";
import type { App } from "@calcom/types/App";
import type { CredentialPayload } from "@calcom/types/Credential";

export { slugify } from "@calcom/lib/slugify";
export { getUsernameList } from "@calcom/lib/defaultEvents";

export { handleCreatePhoneCall };

export { getConnectedDestinationCalendars } from "@calcom/lib/getConnectedDestinationCalendars";
export type { ConnectedDestinationCalendars } from "@calcom/lib/getConnectedDestinationCalendars";
export { getBusyCalendarTimes } from "@calcom/core/CalendarManager";

export {
  transformWorkingHoursForAtom,
  transformAvailabilityForAtom,
  transformDateOverridesForAtom,
  transformApiScheduleAvailability,
  transformApiScheduleOverrides,
} from "@calcom/lib/schedules/transformers";

export { HttpError } from "@calcom/lib/http-error";
export type { AppsStatus } from "@calcom/types/Calendar";

export { MINUTES_TO_BOOK } from "@calcom/lib/constants";

export { cityTimezonesHandler } from "@calcom/features/cityTimezones/cityTimezonesHandler";
export type { CityTimezones } from "@calcom/features/cityTimezones/cityTimezonesHandler";

export { TRPCError } from "@trpc/server";

export { SchedulingType, PeriodType } from "@calcom/prisma/enums";

export { eventTypeBookingFields, eventTypeLocations } from "@calcom/prisma/zod-utils";
export { EventTypeMetaDataSchema, userMetadata } from "@calcom/prisma/zod-utils";

export { parseBookingLimit, parseEventTypeColor } from "@calcom/lib";
export { parseRecurringEvent } from "@calcom/lib/isRecurringEvent";
export { dynamicEvent } from "@calcom/lib/defaultEvents";

export { createNewUsersConnectToOrgIfExists, sendSignupToOrganizationEmail };

export { symmetricEncrypt, symmetricDecrypt };
export { CalendarService };
export { getCalendar };
export { getTranslation };
export { updateNewTeamMemberEventTypes } from "@calcom/lib/server/queries";
export { ErrorCode } from "@calcom/lib/errorCodes";
export { IcsFeedCalendarService };
export { validateCustomEventName } from "@calcom/core/event";
export { getEnabledAppsFromCredentials };
export type { App };
export type { CredentialDataWithTeamName };
export type { LocationOption };
export type { TeamQuery };
export type { CredentialOwner };
export type { TDependencyData };
export type { CredentialPayload };

export { getAppFromSlug };
export { credentialForCalendarServiceSelect };
export { MembershipRole };

export { paymentDataSelect };
export { getClientSecretFromPayment };

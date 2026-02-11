// eslint-disable-next-line no-restricted-imports
import type { TFunction } from "next-i18next";

import type BaseEmail from "@calcom/emails/templates/_base-email";
import logger from "@calcom/lib/logger";

import type { MonthlyDigestEmailData } from "./src/templates/MonthlyDigestEmail";
import type { OrganizationAdminNoSlotsEmailInput } from "./src/templates/OrganizationAdminNoSlots";
import type { EmailVerifyLink } from "./templates/account-verify-email";
import AccountVerifyEmail from "./templates/account-verify-email";
import type { OrganizationNotification } from "./templates/admin-organization-notification";
import AdminOrganizationNotification from "./templates/admin-organization-notification";
import type { EmailVerifyCode } from "./templates/attendee-verify-email";
import AttendeeVerifyEmail from "./templates/attendee-verify-email";
import BrokenIntegrationEmail from "./templates/broken-integration-email";
import type { ChangeOfEmailVerifyLink } from "./templates/change-account-email-verify";
import ChangeOfEmailVerifyEmail from "./templates/change-account-email-verify";
import DisabledAppEmail from "./templates/disabled-app-email";
import type { Feedback } from "./templates/feedback-email";
import FeedbackEmail from "./templates/feedback-email";
import type { PasswordReset } from "./templates/forgot-password-email";
import ForgotPasswordEmail from "./templates/forgot-password-email";
import MonthlyDigestEmail from "./templates/monthly-digest-email";
import OrganizationAdminNoSlotsEmail from "./templates/organization-admin-no-slots-email";
import type { OrganizationCreation } from "./templates/organization-creation-email";
import OrganizationCreationEmail from "./templates/organization-creation-email";
import type { OrganizationEmailVerify } from "./templates/organization-email-verification";
import OrganizationEmailVerification from "./templates/organization-email-verification";
import SlugReplacementEmail from "./templates/slug-replacement-email";
import type { TeamInvite } from "./templates/team-invite-email";
import TeamInviteEmail from "./templates/team-invite-email";

const sendEmail = (prepare: () => BaseEmail) => {
  return new Promise((resolve, reject) => {
    try {
      const email = prepare();
      resolve(email.sendEmail());
    } catch (e) {
      reject(console.error(`${prepare.constructor.name}.sendEmail failed`, e));
    }
  });
};

export const sendPasswordResetEmail = async (passwordResetEvent: PasswordReset) => {
  await sendEmail(() => new ForgotPasswordEmail(passwordResetEvent));
};

export const sendTeamInviteEmail = async (teamInviteEvent: TeamInvite) => {
  await sendEmail(() => new TeamInviteEmail(teamInviteEvent));
};

export const sendOrganizationCreationEmail = async (organizationCreationEvent: OrganizationCreation) => {
  await sendEmail(() => new OrganizationCreationEmail(organizationCreationEvent));
};

export const sendOrganizationAdminNoSlotsNotification = async (
  orgInviteEvent: OrganizationAdminNoSlotsEmailInput
) => {
  await sendEmail(() => new OrganizationAdminNoSlotsEmail(orgInviteEvent));
};

export const sendEmailVerificationLink = async (verificationInput: EmailVerifyLink) => {
  await sendEmail(() => new AccountVerifyEmail(verificationInput));
};

export const sendEmailVerificationCode = async (verificationInput: EmailVerifyCode) => {
  await sendEmail(() => new AttendeeVerifyEmail(verificationInput));
};

export const sendChangeOfEmailVerificationLink = async (verificationInput: ChangeOfEmailVerifyLink) => {
  await sendEmail(() => new ChangeOfEmailVerifyEmail(verificationInput));
};

export const sendFeedbackEmail = async (feedback: Feedback) => {
  await sendEmail(() => new FeedbackEmail(feedback));
};

export const sendBrokenIntegrationEmail = async (evt: { organizer: { email: string; name: string } }, type: "video" | "calendar") => {
  await sendEmail(() => new BrokenIntegrationEmail(evt as any, type));
};

export const sendDisabledAppEmail = async ({
  email,
  appName,
  appType,
  t,
  title = undefined,
  eventTypeId = undefined,
}: {
  email: string;
  appName: string;
  appType: string[];
  t: TFunction;
  title?: string;
  eventTypeId?: number;
}) => {
  await sendEmail(() => new DisabledAppEmail(email, appName, appType, t, title, eventTypeId));
};

export const sendSlugReplacementEmail = async ({
  email,
  name,
  teamName,
  t,
  slug,
}: {
  email: string;
  name: string;
  teamName: string | null;
  t: TFunction;
  slug: string;
}) => {
  await sendEmail(() => new SlugReplacementEmail(email, name, teamName, slug, t));
};

export const sendOrganizationEmailVerification = async (sendOrgInput: OrganizationEmailVerify) => {
  await sendEmail(() => new OrganizationEmailVerification(sendOrgInput));
};

export const sendMonthlyDigestEmails = async (eventData: MonthlyDigestEmailData) => {
  await sendEmail(() => new MonthlyDigestEmail(eventData));
};

export const sendAdminOrganizationNotification = async (input: OrganizationNotification) => {
  await sendEmail(() => new AdminOrganizationNotification(input));
};

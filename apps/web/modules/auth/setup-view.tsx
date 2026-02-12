"use client";

import { useRouter } from "next/navigation";

import { APP_NAME } from "@calcom/lib/constants";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import type { inferSSRProps } from "@calcom/types/inferSSRProps";
import { WizardForm } from "@calcom/ui";

import { AdminUserContainer as AdminUser } from "@components/setup/AdminUser";

import type { getServerSideProps } from "@server/lib/setup/getServerSideProps";

export type PageProps = inferSSRProps<typeof getServerSideProps>;
export function Setup(props: PageProps) {
  const { t } = useLocale();
  const router = useRouter();

  const steps: React.ComponentProps<typeof WizardForm>["steps"] = [
    {
      title: t("administrator_user"),
      description: t("lets_create_first_administrator_user"),
      content: (setIsPending) => (
        <AdminUser
          onSubmit={() => {
            setIsPending(true);
          }}
          onSuccess={() => {
            router.replace("/");
          }}
          onError={() => {
            setIsPending(false);
          }}
          userCount={props.userCount}
        />
      ),
    },
  ];

  return (
    <main className="bg-subtle flex items-center print:h-full md:h-screen">
      <WizardForm
        href="/auth/setup"
        steps={steps}
        nextLabel={t("next_step_text")}
        finishLabel={t("finish")}
        prevLabel={t("prev_step")}
        stepLabel={(currentStep, maxSteps) => t("current_step_of_total", { currentStep, maxSteps })}
      />
    </main>
  );
}

Setup.isThemeSupported = false;

export default Setup;

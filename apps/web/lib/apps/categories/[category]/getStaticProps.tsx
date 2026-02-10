import { Prisma } from "@prisma/client";
import type { GetStaticPropsContext } from "next";

import { getAppRegistry } from "@calcom/app-store/_appRegistry";
import prisma from "@calcom/prisma";
import type { AppCategories } from "@calcom/prisma/enums";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const category = context.params?.category as AppCategories;

  try {
    const appQuery = await prisma.app.findMany({
      where: {
        categories: {
          has: category,
        },
      },
      select: {
        slug: true,
      },
    });

    const dbAppsSlugs = appQuery.map((category) => category.slug);

    const appStore = await getAppRegistry();

    const apps = appStore.filter((app) => dbAppsSlugs.includes(app.slug));
    return {
      props: {
        apps,
      },
    };
  } catch (e: unknown) {
    if (
      e instanceof Prisma.PrismaClientInitializationError ||
      e instanceof Prisma.PrismaClientKnownRequestError
    ) {
      // Database tables don't exist during build time. Return empty apps.
      return {
        props: {
          apps: [],
        },
      };
    }
    throw e;
  }
};

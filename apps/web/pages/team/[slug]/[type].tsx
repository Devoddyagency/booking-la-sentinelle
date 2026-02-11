// Stub - team type page removed
import type { GetServerSidePropsContext } from "next";

import PageWrapper from "@components/PageWrapper";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    notFound: true as const,
  };
};

export default function TeamTypePage() {
  return null;
}

TeamTypePage.PageWrapper = PageWrapper;

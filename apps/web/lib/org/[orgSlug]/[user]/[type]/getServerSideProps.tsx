import type { GetServerSidePropsContext } from "next";

// Booking/event-type functionality removed
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return { notFound: true as const };
};

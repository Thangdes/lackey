export type { Review } from "@/type/review";

export type TikTokCardProps = {
  url: string;
  vid?: string;
};

export type ReviewCardProps = {
  review: import("@/type/review").Review;
};

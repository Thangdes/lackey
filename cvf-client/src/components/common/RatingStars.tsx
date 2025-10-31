"use client";

import React from "react";
import { IoIosStar } from "react-icons/io";

export type RatingStarsProps = {
  value: number; // 0..5
  size?: number; // icon size in rem px unit via tailwind not needed, we use className
  className?: string;
  "aria-label"?: string;
};

const RatingStars: React.FC<RatingStarsProps> = ({ value, className = "", ...rest }) => {
  const v = Math.max(0, Math.min(5, Number(value ?? 0)));
  const full = Math.floor(v);
  return (
    <div className={["flex items-center gap-0.5", className].join(" ")} {...rest}>
      {Array.from({ length: 5 }).map((_, i) => (
        <IoIosStar key={i} className={`h-3.5 w-3.5 ${i < full ? "" : "text-neutral-300"}`} />
      ))}
    </div>
  );
};

export default React.memo(RatingStars);

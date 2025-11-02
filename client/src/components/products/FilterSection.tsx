"use client";

import React from "react";

export type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, className = "" }) => {
  return (
    <div className={["border-b border-neutral-200 pb-4 mb-4", className].join(" ")}>
      <div className="mb-2 text-sm font-semibold text-[var(--color-cod-gray-900)]">{title}</div>
      {children}
    </div>
  );
};

export default FilterSection;

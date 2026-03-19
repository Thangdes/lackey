"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ClientOnly({ children }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

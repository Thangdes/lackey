"use client";

import { useCallback } from "react";
import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Toolbar({ search, onSearchChange }: Props) {
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => onSearchChange(e.target.value),
    [onSearchChange]
  );

  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
          <input
            type="text"
            className="w-64 rounded border pl-8 pr-3 py-2 text-sm"
            placeholder="Tìm kiếm theo tên, email, số điện thoại"
            value={search}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

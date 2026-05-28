import type { CategoryWithCount } from "@/type/category";

export type { CategoryWithCount };

export type CategoryBarProps = {
  showIcons?: boolean;
  wrapSmall?: boolean;
  showCounts?: boolean;
  maxVisible?: number;
};

export type ArrowButtonProps = {
  side: 'left' | 'right';
  visible: boolean;
  disabled: boolean;
  onClick: () => void;
  className?: string;
};

export type HeaderSearchProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type FooterProps = {
  className?: string;
};

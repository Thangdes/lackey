/**
 * Layout component props types
 */

import type { Category } from "@/service/category.service";

export interface CategoryWithCount extends Category {
  productCount?: number;
}

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

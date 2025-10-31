import type { ComponentType } from "react";

export type Category = {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  group: "Shop" | "Marketplaces" | "Regions" | "Discover" | "Meta";
  badge?: string;
  iconColor?: string;
  emoji?: string;
  imagePath?: string; // optional image for marketplaces (e.g., /marketplaces/mercari.svg)
  imageWidth?: number; // optional custom image width for logo rendering
  imageHeight?: number; // optional custom image height for logo rendering
};

export type CategoryGroup = Category["group"];

export type GroupTabsProps = {
  groups: CategoryGroup[];
  activeGroup: CategoryGroup;
  onSelect: (g: CategoryGroup) => void;
  className?: string;
  buttonClassName?: string;
};

export type MegaMenuData = Record<string, string[]>;



export const AREAS = [
  'TP. HCM',
  'Ngoài TP. HCM',
] as const;

export type Area = typeof AREAS[number];

export const DEFAULT_AREA: Area = 'TP. HCM';

export const TOP_AREA_LS_KEY = 'top_area_v1';

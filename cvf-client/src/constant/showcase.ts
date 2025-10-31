import type { ShowcaseItem } from '@/type/showcase';
import { ROUTES } from '@/constant/route';

export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABFQEG7k1lNwAAAABJRU5ErkJggg==';

export const SHOWCASE_IDEAS: ShowcaseItem[] = [
  { src: '/images/product/1.jpg', title: 'Bông lan trứng muối', href: `${ROUTES.blog}/long-do-trung-muoi` },
  { src: '/images/product/2.jpg', title: 'Trứng vịt muối', href: `${ROUTES.blog}/long-do-trung-muoi` },
  { src: '/images/product/3.jpg', title: 'Lòng đỏ trứng muối', href: `${ROUTES.blog}/long-do-trung-muoi` },
  { src: '/images/product/4.jpg', title: 'Bánh trung thu trứng muối', href: `${ROUTES.blog}/long-do-trung-muoi` },
  { src: '/images/product/5.jpg', title: 'Bánh bao trứng muối', href: `${ROUTES.blog}/long-do-trung-muoi` },
  { src: '/images/product/6.jpg', title: 'Bánh trứng muối', href: `${ROUTES.blog}/long-do-trung-muoi` },
  { src: '/images/product/7.jpg', title: 'Bánh bông lan trứng muối', href: `${ROUTES.blog}/long-do-trung-muoi` },
];

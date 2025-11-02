import { ContentType } from '@prisma/client';

export class SiteContent {
  id: string;
  type: ContentType;
  title: string;
  content?: string;
  thumbnailUrl?: string;
  linkUrl?: string;
  authorName?: string;
  authorTitle?: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
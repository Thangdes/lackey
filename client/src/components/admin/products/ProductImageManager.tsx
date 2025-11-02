"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export type ProductImageManagerProps = {
  thumbnailUrl?: string;
  thumbnailObjectUrl: string | null;
  images: string[];
  pendingPreviews: string[];
  uploading: boolean;
  onThumbnailFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImgUrlKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddImageButtonClick: () => void;
  onImageDragStart: (e: React.DragEvent<HTMLLIElement>) => void;
  onDrop: (e: React.DragEvent<HTMLUListElement>) => void;
  onAllowDrop: (e: React.DragEvent) => void;
  onRemoveImageClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onFilesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadImages: () => void;
  imgUrlRef: React.RefObject<HTMLInputElement>;
};

export default function ProductImageManager({
  thumbnailUrl,
  thumbnailObjectUrl,
  images,
  pendingPreviews,
  uploading,
  onThumbnailFileChange,
  onImgUrlKeyDown,
  onAddImageButtonClick,
  onImageDragStart,
  onDrop,
  onAllowDrop,
  onRemoveImageClick,
  onFilesChange,
  onUploadImages,
  imgUrlRef,
}: ProductImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Ảnh đại diện (Thumbnail)</label>
        <Input type="file" accept="image/*" onChange={onThumbnailFileChange} />
        {(thumbnailObjectUrl || thumbnailUrl) && (
          <div className="mt-2">
            <Image
              src={thumbnailObjectUrl || thumbnailUrl || ""}
              alt="Thumbnail preview"
              width={200}
              height={200}
              className="rounded border"
              unoptimized
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Thêm ảnh sản phẩm (URL)</label>
        <div className="flex gap-2">
          <Input
            ref={imgUrlRef}
            placeholder="https://example.com/image.jpg"
            onKeyDown={onImgUrlKeyDown}
          />
          <Button type="button" onClick={onAddImageButtonClick} className="inline-flex items-center gap-1">
            <Plus className="size-4" aria-hidden />
            Thêm
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-2">Ảnh hiện tại (kéo để sắp xếp)</div>
          <ul
            className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto"
            onDrop={onDrop}
            onDragOver={onAllowDrop}
          >
            {images.map((url, i) => (
              <li
                key={url}
                draggable
                data-index={i}
                data-url={url}
                onDragStart={onImageDragStart}
                className="relative group cursor-move"
              >
                <Image
                  src={url}
                  alt={`Image ${i + 1}`}
                  width={150}
                  height={150}
                  className="rounded border w-full h-auto"
                  unoptimized
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  data-url={url}
                  onClick={onRemoveImageClick}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <Trash2 className="size-3" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Upload thêm ảnh (tối đa 10)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFilesChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        {pendingPreviews.length > 0 && (
          <div className="mt-2">
            <div className="text-xs text-muted-foreground mb-1">
              {pendingPreviews.length} ảnh đang chờ upload
            </div>
            <div className="grid grid-cols-5 gap-1">
              {pendingPreviews.map((url, i) => (
                <Image
                  key={i}
                  src={url}
                  alt={`Preview ${i + 1}`}
                  width={80}
                  height={80}
                  className="rounded border"
                  unoptimized
                />
              ))}
            </div>
            <Button
              type="button"
              onClick={onUploadImages}
              disabled={uploading}
              className="mt-2"
            >
              {uploading ? "Đang tải lên..." : "Xác nhận tải lên"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRef, useState, useCallback } from "react";
import { ImageIcon, UploadCloud, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestUploadUrl } from "@/actions/game";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface ImageUploadInputProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label: string;
  dropzoneClassName?: string;
  error?: string;
  disabled?: boolean;
}

export function ImageUploadInput({
  value,
  onChange,
  label,
  dropzoneClassName = "h-40",
  error,
  disabled,
}: ImageUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Accepted: JPEG, PNG, WebP, GIF");
        return;
      }

      if (file.size > MAX_SIZE_BYTES) {
        setUploadError("Max size: 5 MB");
        return;
      }

      try {
        setLoading(true);
        const result = await requestUploadUrl(file.name, file.type);

        if (!result.success || !result.data) {
          throw new Error(result.error ?? "Upload failed");
        }

        const { uploadUrl, finalUrl } = result.data;

        const res = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

        onChange(finalUrl);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setLoading(false);
      }
    },
    [onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setUploadError(null);
  };

  const isLoading = loading;
  const hasError = !!(error || uploadError);

  return (
    <div className="flex flex-col gap-2">
      <label className="ml-1 text-sm font-medium text-zinc-400">{label}</label>

      <div
        onClick={() => !disabled && !isLoading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "group relative overflow-hidden rounded-lg border-2 border-dashed transition-colors",
          dropzoneClassName,
          hasError
            ? "border-red-500/60"
            : isDragging
              ? "border-white/50 bg-white/5"
              : "border-white/20 hover:border-white/40",
          !disabled && !isLoading && "cursor-pointer",
          disabled && "opacity-50",
        )}
      >
        {/* Background image preview */}
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all",
            value
              ? "bg-black/50 opacity-0 group-hover:opacity-100"
              : "bg-white/3",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          ) : value ? (
            <>
              <UploadCloud className="h-5 w-5 text-zinc-200" />
              <span className="text-xs font-medium text-zinc-200">
                Click to change
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="h-7 w-7 text-zinc-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-400">
                  Drop image or click to upload
                </p>
                <p className="text-xs text-zinc-500">
                  JPEG, PNG, WebP, GIF · max 5 MB
                </p>
              </div>
            </>
          )}
        </div>

        {/* Clear button */}
        {value && !isLoading && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {(error || uploadError) && (
        <p className="field-error-text">{error ?? uploadError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled || isLoading}
      />
    </div>
  );
}

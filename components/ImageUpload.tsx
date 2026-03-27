"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function ImageUpload({ onUpload, currentUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar 5MB");
      return;
    }

    setError("");
    setUploading(true);

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const supabase = createSupabaseBrowser();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(fileName, file);

    if (uploadError) {
      setError(uploadError.message);
      setPreview(currentUrl ?? null);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(fileName);

    setPreview(urlData.publicUrl);
    onUpload(urlData.publicUrl);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-[#f49d25]/50 transition-colors"
      >
        {preview ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
            <Image
              src={preview}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain p-4"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Subiendo...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-300">cloud_upload</span>
            <p className="text-sm text-slate-500">
              Arrastra una imagen o <span className="text-[#f49d25] font-semibold">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-slate-400">PNG, JPG hasta 5MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

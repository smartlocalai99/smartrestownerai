import { useRef, useState } from "react";
import LazyImage from "@/components/owner/LazyImage";
import { MdOutlineAddPhotoAlternate, MdClose } from "react-icons/md";
import { uploadRestaurantImage, deleteRestaurantImage } from "@/lib/storage.mjs";

export default function ImageUploadField({ value, onChange, folder, label, aspectClassName = "aspect-square" }) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setIsUploading(true);
    const previousUrl = value;
    try {
      const newUrl = await uploadRestaurantImage(file, folder);
      onChange(newUrl);
      if (previousUrl) {
        await deleteRestaurantImage(previousUrl);
      }
    } catch (err) {
      setError(err.message || "Upload failed. Try a smaller image.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove() {
    if (!value) return;
    const previousUrl = value;
    onChange(null);
    try {
      await deleteRestaurantImage(previousUrl);
    } catch {
      // Row already points elsewhere; leftover storage object is harmless.
    }
  }

  return (
    <div>
      {label ? <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">{label}</p> : null}
      <div className={`relative ${aspectClassName} w-full overflow-hidden rounded-2xl border border-line bg-canvas`}>
        {value ? (
          <LazyImage src={value} alt="" sizes="240px" skeletonClassName="bg-canvas" className="object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted"
          >
            <MdOutlineAddPhotoAlternate size={28} />
            <span className="text-xs">{isUploading ? "Uploading…" : "Add photo"}</span>
          </button>
        )}

        {value ? (
          <div className="absolute inset-x-0 bottom-0 flex justify-between p-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="rounded-lg bg-canvas/80 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur"
            >
              {isUploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-canvas/80 text-ink backdrop-blur"
              aria-label="Remove photo"
            >
              <MdClose size={16} />
            </button>
          </div>
        ) : null}
      </div>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
    </div>
  );
}

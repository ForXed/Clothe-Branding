import React, { useEffect, useRef, useState } from "react";
import { DeliverPayload } from "../../services/orderService";
import { ActionResult } from "../../hooks/useOrder";
import styles from "./OrderView.module.css";

type PreviewImage = { id: string; file: File; preview: string };
const MAX_FILES = 6;
const MAX_SIZE_MB = 5;

const DeliveryProof = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (payload: DeliverPayload) => Promise<ActionResult>;
}) => {
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const imagesRef = useRef<PreviewImage[]>(images);
  imagesRef.current = images;
  useEffect(() => {
    return () =>
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
  }, []);

  const close = () => {
    if (!submitting) onClose();
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    let message = "";

    const current = imagesRef.current;
    const accepted: PreviewImage[] = [];

    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        message = `"${file.name}" is not an image.`;
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        message = `"${file.name}" is larger than ${MAX_SIZE_MB}MB.`;
        continue;
      }
      const id = `${file.name}-${file.size}-${file.lastModified}`;
      if (current.some((i) => i.id === id) || accepted.some((i) => i.id === id))
        continue;

      if (current.length + accepted.length >= MAX_FILES) {
        message = `You can upload a maximum of ${MAX_FILES} images.`;
        break;
      }
      accepted.push({ id, file, preview: URL.createObjectURL(file) });
    }

    setError(message);
    if (accepted.length) setImages([...current, ...accepted]);
  };

  const removeImage = (id: string) => {
    const target = images.find((i) => i.id === id);
    if (target) URL.revokeObjectURL(target.preview);
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (images.length === 0) return setError("Add at least one image.");

    setSubmitting(true);
    const result = await onSubmit({
      proofImages: images.map((i) => i.file),
    });
    setSubmitting(false);

    if (result.ok) onClose();
    else setError(result.message);
  };

  return (
    <div className={styles.modal} onClick={close}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <section className={styles.header}>
          <p>Upload Delivery Proof</p>
          <button type="button" onClick={close}>
            X
          </button>
        </section>

        <div>
          <label htmlFor="imageProof">
            Attach Image Proof ({images.length}/{MAX_FILES})
          </label>
          <label htmlFor="imageProof" className={styles.dropzone}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-image-plus preview-icon"
            >
              <path d="M16 5h6" />
              <path d="M19 2v6" />
              <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              <circle cx="9" cy="9" r="2" />
            </svg>
          </label>
          <input
            id="imageProof"
            name="imageProof"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFiles}
          />
        </div>

        {images.length > 0 && (
          <ul className={styles.previewGrid}>
            {images.map((img) => (
              <li key={img.id}>
                <img src={img.preview} alt={img.file.name} />
                <button
                  type="button"
                  aria-label={`Remove ${img.file.name}`}
                  onClick={() => removeImage(img.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <section className={styles.actions}>
          <button type="button" onClick={close} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Uploading..." : "Upload Proof"}
          </button>
        </section>
      </form>
    </div>
  );
};
export default DeliveryProof;

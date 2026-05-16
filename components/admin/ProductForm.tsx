"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";

type Props = { product?: ProductDTO };

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const editing = Boolean(product);

  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await res.json().catch(() => ({}));
    setUploading(false);
    e.target.value = "";
    if (res.ok && d.url) setImages((arr) => [...arr, d.url]);
    else setError(d.error || "Upload failed.");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      slug: String(fd.get("slug") || "").trim() || undefined,
      description: String(fd.get("description") || ""),
      scentNotes: String(fd.get("scentNotes") || ""),
      priceMAD: Number(fd.get("priceMAD") || 0),
      category: String(fd.get("category") || "CANDLE"),
      stock: Number(fd.get("stock") || 0),
      status: fd.get("status") === "on" ? "ACTIVE" : "DRAFT",
      featured: fd.get("featured") === "on",
      weightG: fd.get("weightG") ? Number(fd.get("weightG")) : null,
      burnTime: String(fd.get("burnTime") || "").trim() || null,
      images,
    };

    const url = editing
      ? `/api/admin/products/${product!.id}`
      : "/api/admin/products";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const d = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(d.error || "Could not save.");
    }
  }

  async function onDelete() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setDeleting(false);
      setError("Could not delete.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <p className="eyebrow">{editing ? "Edit product" : "New product"}</p>
      <h1 className="mt-4 font-display text-4xl font-light">
        {editing ? product!.name : "Create a product"}
      </h1>

      <div className="mt-12 space-y-9">
        <Field label="Name">
          <input
            name="name"
            required
            defaultValue={product?.name}
            className="field"
          />
        </Field>

        <Field label="URL slug (optional — auto from name)">
          <input
            name="slug"
            defaultValue={product?.slug}
            placeholder="amber-noir"
            className="field"
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description}
            className="field resize-none"
          />
        </Field>

        <Field label="Scent notes (comma separated)">
          <input
            name="scentNotes"
            defaultValue={product?.scentNotes}
            placeholder="Amber, Tonka Bean, Cedarwood"
            className="field"
          />
        </Field>

        <div className="grid grid-cols-2 gap-8">
          <Field label="Price (DH)">
            <input
              name="priceMAD"
              type="number"
              min={0}
              required
              defaultValue={product?.priceMAD ?? 0}
              className="field"
            />
          </Field>
          <Field label="Stock">
            <input
              name="stock"
              type="number"
              min={0}
              defaultValue={product?.stock ?? 0}
              className="field"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Field label="Category">
            <select
              name="category"
              defaultValue={product?.category ?? "CANDLE"}
              className="field"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fill weight (g, optional)">
            <input
              name="weightG"
              type="number"
              min={0}
              defaultValue={product?.weightG ?? ""}
              className="field"
            />
          </Field>
        </div>

        <Field label="Burn time (optional)">
          <input
            name="burnTime"
            defaultValue={product?.burnTime ?? ""}
            placeholder="45+ hours"
            className="field"
          />
        </Field>

        {/* Images */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-taupe">
            Images
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            {images.map((src, i) => (
              <div
                key={src + i}
                className="relative h-28 w-24 overflow-hidden border border-line bg-ivory-2"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((a) => a.filter((_, idx) => idx !== i))
                  }
                  className="absolute right-1 top-1 bg-ink px-1.5 text-xs text-ivory"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex h-28 w-24 cursor-pointer flex-col items-center justify-center border border-dashed border-line text-center text-xs text-taupe hover:border-ink hover:text-ink">
              {uploading ? "Uploading…" : "+ Add"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="flex gap-10 border-t border-line pt-8">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="status"
              defaultChecked={(product?.status ?? "ACTIVE") === "ACTIVE"}
            />
            Active (visible in store)
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
            />
            Signature (featured)
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-line pt-8">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="text-xs uppercase tracking-[0.2em] text-taupe hover:text-red-700"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-taupe">
        {label}
      </span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

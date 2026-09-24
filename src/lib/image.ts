export const R2_MAX_BYTES = 8 * 1024 * 1024;
export const R2_ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"];
export const R2_ALLOWED_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

export function extFromMime(mime: string) {
  const m: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/heic": "heic",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  };
  return m[mime] ?? "bin";
}

export function isImage(mime: string) {
  return mime.startsWith("image/");
}

export async function compressImage(buf: Buffer, mime: string): Promise<{ buf: Uint8Array; mime: string; ext: string }> {
  if (!isImage(mime)) return { buf: new Uint8Array(buf), mime, ext: extFromMime(mime) };

  if (mime === "image/avif" || mime === "image/webp") {
    if (buf.length <= 900 * 1024) return { buf: new Uint8Array(buf), mime, ext: extFromMime(mime) };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod = (await import("sharp").catch(() => null)) as any;
    const sharpFn: ((b: Buffer, o?: unknown) => import("sharp").Sharp) | null =
      mod?.default ?? mod ?? null;
    if (!sharpFn) return fallbackResize(buf, mime);

    let s = sharpFn(buf, { failOn: "none" } as unknown as never).rotate();

    const meta = await s.metadata().catch(() => null);
    const w = meta?.width ?? 0;
    const h = meta?.height ?? 0;
    const maxSide = 1920;
    if ((w > maxSide || h > maxSide) && w && h) {
      s = s.resize({ width: w >= h ? maxSide : undefined, height: h > w ? maxSide : undefined, withoutEnlargement: true, fit: "inside" });
    }

    const webp = await s.webp({ quality: 78, effort: 4 }).toBuffer();
    if (webp.length < buf.length * 0.97) return { buf: new Uint8Array(webp), mime: "image/webp", ext: "webp" };

    const jpeg = await sharpFn!(buf, { failOn: "none" } as unknown as never)
      .rotate()
      .resize({ width: w >= h ? maxSide : undefined, height: h > w ? maxSide : undefined, withoutEnlargement: true, fit: "inside" })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
    return { buf: new Uint8Array(jpeg), mime: "image/jpeg", ext: "jpg" };
  } catch {
    return fallbackResize(buf, mime);
  }
}

async function fallbackResize(buf: Buffer, mime: string) {
  return { buf: new Uint8Array(buf), mime, ext: extFromMime(mime) };
}

export function validateUpload(file: { size: number; type: string; name: string }) {
  const allowed = [...R2_ALLOWED_IMAGE, ...R2_ALLOWED_VIDEO];
  if (!allowed.includes(file.type) && !file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    throw new Error(`Tipe file tidak didukung: ${file.type}`);
  }
  if (file.size > R2_MAX_BYTES) throw new Error(`File terlalu besar, maks ${R2_MAX_BYTES / 1024 / 1024}MB`);
}

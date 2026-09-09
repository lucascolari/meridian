interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
  if (!cloud) return src;
  const q = quality ?? 75;
  const transforms = `f_auto,q_${q},w_${width}`;
  const encoded = encodeURIComponent(src);
  return `https://res.cloudinary.com/${cloud}/image/fetch/${transforms}/${encoded}`;
}

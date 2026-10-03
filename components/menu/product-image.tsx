import Image from "next/image";
import { Flame } from "lucide-react";
import type { Product } from "@/types/product";

/** Imagen con proporción fija y fallback coherente cuando no hay fotografía. */
export function ProductImage({
  product,
  ratio = "aspect-[4/3]",
  sizes = "(min-width:1280px) 25vw, (min-width:768px) 33vw, 100vw",
  priority,
  className = "",
}: {
  product: Product;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const img = product.images[0];
  return (
    <div className={`food-wrap relative overflow-hidden bg-surface2 ${ratio} ${className}`}>
      {img ? (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="photo-warm object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
        />
      ) : (
        <div className="ember-glow flex h-full w-full flex-col items-center justify-center gap-2 text-cream2/60" role="img" aria-label={`${product.name}: sin fotografía`}>
          <Flame className="size-9" aria-hidden />
          <span className="text-xs uppercase tracking-widest">Foto próximamente</span>
        </div>
      )}
    </div>
  );
}

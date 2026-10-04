import Image from "next/image";
import type { Product } from "@/types/product";

/** Imagen con proporción fija; sin fotografía muestra el logo de la casa. */
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
    <div className={`food-wrap @container relative overflow-hidden bg-surface2 ${ratio} ${className}`}>
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
        <div className="ember-glow flex h-full w-full items-center justify-center" role="img" aria-label={product.name}>
          <Image src="/img/logo-mark.webp" alt="" width={160} height={160} loading="eager" className="h-2/5 w-auto opacity-35" />
        </div>
      )}
    </div>
  );
}

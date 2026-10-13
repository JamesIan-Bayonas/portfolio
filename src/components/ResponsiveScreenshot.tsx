export interface ScreenshotAsset {
  width: number
  height: number
  variants: {
    src: string
    width: number
  }[]
}

interface ResponsiveScreenshotProps {
  asset: ScreenshotAsset
  alt: string
  sizes: string
  loading?: "lazy" | "eager"
}

export default function ResponsiveScreenshot({
  asset,
  alt,
  sizes,
  loading = "lazy",
}: ResponsiveScreenshotProps) {
  return (
    <img
      src={asset.variants[asset.variants.length - 1].src}
      srcSet={asset.variants.map(variant => `${variant.src} ${variant.width}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      width={asset.width}
      height={asset.height}
      loading={loading}
      decoding="async"
    />
  )
}

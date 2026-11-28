import type { ImageFile } from '@shared/types'

// The cover picture first, the others in their original order.
export function coverFirst(images: ImageFile[] = []): ImageFile[] {
  return [...images.filter((image) => image.is_cover), ...images.filter((image) => !image.is_cover)]
}

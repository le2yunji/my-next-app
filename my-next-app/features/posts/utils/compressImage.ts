const TARGET_WIDTH = 468;
const SQUARE_HEIGHT = 468; // 1:1
const PORTRAIT_HEIGHT = 585; // 4:5
const MAX_BYTES = 1 * 1024 * 1024; // 1MB

function getTargetHeight(naturalWidth: number, naturalHeight: number): number {
  return naturalWidth >= naturalHeight ? SQUARE_HEIGHT : PORTRAIT_HEIGHT;
}

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob 실패"))),
      type,
      quality,
    );
  });
}

/** 이미지를 468×468 또는 468×585로 크롭·리사이즈 후 1MB 이하 JPEG로 압축 */
export async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const targetW = TARGET_WIDTH;
  const targetH = getTargetHeight(bitmap.width, bitmap.height);
  const targetRatio = targetW / targetH;

  // 센터 크롭 계산 (object-fit: cover 방식)
  let srcX = 0,
    srcY = 0;
  let srcW = bitmap.width,
    srcH = bitmap.height;

  if (bitmap.width / bitmap.height > targetRatio) {
    // 원본이 더 넓음 → 좌우 크롭
    srcW = bitmap.height * targetRatio;
    srcX = (bitmap.width - srcW) / 2;
  } else {
    // 원본이 더 높음 → 상하 크롭
    srcH = bitmap.width / targetRatio;
    srcY = (bitmap.height - srcH) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  canvas.getContext("2d")!.drawImage(
    bitmap,
    srcX,
    srcY,
    srcW,
    srcH,
    0,
    0,
    targetW,
    targetH,
  );
  bitmap.close();

  // 1MB 이하가 될 때까지 quality를 낮춰가며 압축
  const qualities = [0.85, 0.7, 0.55, 0.4, 0.25, 0.1];
  for (const quality of qualities) {
    const blob = await toBlob(canvas, "image/jpeg", quality);
    if (blob.size <= MAX_BYTES) {
      return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
        type: "image/jpeg",
      });
    }
  }

  // 최소 quality fallback
  const blob = await toBlob(canvas, "image/jpeg", 0.1);
  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

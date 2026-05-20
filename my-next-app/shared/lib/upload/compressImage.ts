type CompressImageVariant = "post" | "profile";

type CompressImageOptions = {
  variant?: CompressImageVariant;
};

const POST_TARGET_WIDTH = 468;
const POST_SQUARE_HEIGHT = 468; // 1:1
const POST_PORTRAIT_HEIGHT = 585; // 4:5

const PROFILE_TARGET_WIDTH = 512;
const PROFILE_TARGET_HEIGHT = 512; // 1:1
const MAX_BYTES = 1 * 1024 * 1024; // 1MB

const JPEG_QUALITIES = [0.85, 0.7, 0.55, 0.4, 0.25, 0.1];

// 원본 이미지의 가로길이가 세로보다 길거나 같으면 1:1, 더 짧으면 4:5
function getPostTargetHeight(
  naturalWidth: number,
  naturalHeight: number,
): number {
  return naturalWidth >= naturalHeight
    ? POST_SQUARE_HEIGHT
    : POST_PORTRAIT_HEIGHT;
}

function getTargetSize(
  naturalWidth: number,
  naturalHeight: number,
  variant: CompressImageVariant,
): { width: number; height: number } {
  if (variant === "profile") {
    return {
      width: PROFILE_TARGET_WIDTH,
      height: PROFILE_TARGET_HEIGHT,
    };
  }
  return {
    width: POST_TARGET_WIDTH,
    height: getPostTargetHeight(naturalWidth, naturalHeight),
  };
}

function isGif(file: File): boolean {
  return file.type === "image/gif";
}

function replaceExtension(fileName: string, ext: string): string {
  if (/\.[^.]+$/.test(fileName)) {
    return fileName.replace(/\.[^.]+$/, `.${ext}`);
  }
  return `${fileName}.${ext}`;
}

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob 실패"))),
      type,
      quality,
    );
  });
}

async function compressCanvasToJpeg(
  canvas: HTMLCanvasElement,
  originalFileName: string,
): Promise<File> {
  let lastBlob: Blob | null = null;

  // 1MB 이하가 되면 File로 변환해서 반환
  // 끝까지 1MB 이하가 안 되면 마지막 blob을 File로 반환
  for (const quality of JPEG_QUALITIES) {
    const blob = await toBlob(canvas, "image/jpeg", quality);
    lastBlob = blob;

    if (blob.size <= MAX_BYTES) {
      return new File([blob], replaceExtension(originalFileName, "jpg"), {
        type: "image/jpeg",
      });
    }
  }

  if (!lastBlob) {
    throw new Error("이미지 압축에 실패했습니다.");
  }

  return new File([lastBlob], replaceExtension(originalFileName, "jpg"), {
    type: "image/jpeg",
  });
}

async function compressGif(file: File): Promise<File> {
  // GIF는 canvas로 처리하면 애니메이션이 깨지고 첫 프레임만 남음.
  // 그래서 GIF는 원본 포맷을 유지한다.
  if (file.size <= MAX_BYTES) {
    return file;
  }

  // 브라우저에서 GIF 애니메이션을 유지하면서 안정적으로 리사이즈/압축하는 건
  // canvas만으로는 어렵다. 일단 포맷 유지를 우선한다.
  return file;
}

/**
 * 이미지를 업로드용으로 압축
 *
 * post:
 * - 가로/정사각형 원본: 468x468
 * - 세로형 원본: 468x585
 *
 * profile:
 * - 항상 512x512
 *
 * gif:
 * - 포맷 유지를 위해 canvas 변환하지 않고 원본 반환
 */
export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  const variant = options.variant ?? "post";

  if (isGif(file)) {
    return compressGif(file);
  }

  const bitmap = await createImageBitmap(file);

  const { width: targetW, height: targetH } = getTargetSize(
    bitmap.width,
    bitmap.height,
    variant,
  );

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

  // canvas 생성
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  // canvas에 크롭된 이미지를 리사이즈해서 그림
  const ctx = canvas.getContext("2d")!;

  if (!ctx) {
    bitmap.close();
    throw new Error("canvas context 생성에 실패했습니다.");
  }

  ctx.fillStyle = "#fff"; // 투명 배경의 png 파일 대비
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(bitmap, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH);
  bitmap.close(); // bitmap 메모리 해제

  // 1MB 이하가 될 때까지 quality를 낮춰가며 압축
  return compressCanvasToJpeg(canvas, file.name);
}

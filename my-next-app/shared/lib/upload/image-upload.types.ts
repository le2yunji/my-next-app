import type { UploadContext } from "./image-upload.constants";

export type ImageUploadFileMeta = {
  mimeType: string;
  size: number;
};

export type UploadedImageResult = {
  presignedUrl: string;
  key: string;
  publicUrl: string;
};

export type UploadImageContext = UploadContext;

export type ImagePickerOptions = {
  context: UploadContext;
  multiple?: boolean;
  compress?: (file: File) => Promise<File>;
};

export type ImagePickerResult = {
  files: File[];
  previewUrls: string[];
  previewIndex: number;
  setPreviewIndex: React.Dispatch<React.SetStateAction<number>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isProcessing: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  openFileDialog: () => void;
  handleAddMore: () => void;
  removeFile: (index: number) => void;
  clear: () => void;
};

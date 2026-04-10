export type BoardPreviewImage = {
  id: string;
  url: string;
};

export type BoardItem = {
  id: string;
  title: string;
  description?: string;
  saveCount: number;
  category?: string;
  previewImages: BoardPreviewImage[];
};

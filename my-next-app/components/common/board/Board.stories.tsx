import type { Meta, StoryObj } from "@storybook/react";
import BoardCard from "./Board";
import type { BoardItem } from "@/types/board";

const mockBoard: BoardItem = {
  id: "1",
  title: "제주도 여행",
  description: "제주도 여행 사진 모음",
  saveCount: 42,
  category: "여행",
  previewImages: [
    { id: "1", url: "https://picsum.photos/seed/a/400/300" },
    { id: "2", url: "https://picsum.photos/seed/b/400/300" },
    { id: "3", url: "https://picsum.photos/seed/c/400/300" },
  ],
};

const meta: Meta<typeof BoardCard> = {
  title: "Common/BoardCard",
  component: BoardCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["lg", "md", "sm"],
    },
    showArrow: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    board: mockBoard,
    size: "md",
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export const Large: Story = {
  args: {
    board: mockBoard,
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="w-105">
        <Story />
      </div>
    ),
  ],
};

export const Small: Story = {
  args: {
    board: mockBoard,
    size: "sm",
  },
  decorators: [
    (Story) => (
      <div className="w-50">
        <Story />
      </div>
    ),
  ],
};

export const NoImages: Story = {
  args: {
    board: { ...mockBoard, previewImages: [] },
    size: "md",
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export const OneImage: Story = {
  args: {
    board: { ...mockBoard, previewImages: [mockBoard.previewImages[0]] },
    size: "md",
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export const WithArrow: Story = {
  args: {
    board: mockBoard,
    size: "md",
    showArrow: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

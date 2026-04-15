import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Bookmark } from "lucide-react";
import { SecondaryButton } from "./SecondaryButton";

const meta: Meta<typeof SecondaryButton> = {
  title: "Common/Button/SecondaryButton",
  component: SecondaryButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["lg", "md", "sm"],
    },
    active: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "버튼",
    size: "md",
  },
};

export const Active: Story = {
  args: {
    children: "활성화",
    active: true,
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "큰 버튼",
    size: "lg",
  },
};

export const Small: Story = {
  args: {
    children: "작은 버튼",
    size: "sm",
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <SecondaryButton {...args} icon={<Plus size={16} />}>
      추가하기
    </SecondaryButton>
  ),
};

export const WithBookmarkIcon: Story = {
  render: (args) => (
    <SecondaryButton {...args} icon={<Bookmark size={16} />} active>
      저장됨
    </SecondaryButton>
  ),
};

export const Disabled: Story = {
  args: {
    children: "비활성화",
    disabled: true,
  },
};

export const TabGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <SecondaryButton active>Boards</SecondaryButton>
      <SecondaryButton>Posts</SecondaryButton>
      <SecondaryButton>Saved</SecondaryButton>
    </div>
  ),
};

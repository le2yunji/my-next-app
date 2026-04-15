import type { Meta, StoryObj } from "@storybook/react";
import { PrimaryButton } from "./PrimaryButton";

const meta: Meta<typeof PrimaryButton> = {
  title: "Common/Button/PrimaryButton",
  component: PrimaryButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["lg", "md", "sm"],
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

export const Disabled: Story = {
  args: {
    children: "비활성화",
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3">
      <PrimaryButton size="lg">큰 버튼</PrimaryButton>
      <PrimaryButton size="md">중간 버튼</PrimaryButton>
      <PrimaryButton size="sm">작은 버튼</PrimaryButton>
    </div>
  ),
};

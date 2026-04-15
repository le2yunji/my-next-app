import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "./PasswordInput";

const meta: Meta<typeof PasswordInput> = {
  title: "Common/Input/PasswordInput",
  component: PasswordInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    showToggle: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "비밀번호를 입력하세요",
  },
};

export const WithLabel: Story = {
  args: {
    label: "비밀번호",
    placeholder: "비밀번호를 입력하세요",
  },
};

export const WithError: Story = {
  args: {
    label: "비밀번호",
    placeholder: "비밀번호를 입력하세요",
    error: true,
    errorMessage: "비밀번호가 올바르지 않습니다",
  },
};

export const Disabled: Story = {
  args: {
    label: "비밀번호",
    placeholder: "비밀번호를 입력하세요",
    disabled: true,
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "lucide-react";
import { TextInput } from "./TextInput";

const meta: Meta<typeof TextInput> = {
  title: "Common/Input/TextInput",
  component: TextInput,
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "텍스트를 입력하세요",
  },
};

export const WithLabel: Story = {
  args: {
    label: "이름",
    placeholder: "이름을 입력하세요",
  },
};

export const WithError: Story = {
  args: {
    label: "이메일",
    placeholder: "이메일을 입력하세요",
    error: true,
    errorMessage: "올바른 이메일 형식이 아닙니다",
    defaultValue: "invalid-email",
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: "검색어를 입력하세요",
    leftElement: <Search size={18} />,
  },
};

export const Disabled: Story = {
  args: {
    label: "비활성화",
    placeholder: "입력 불가",
    disabled: true,
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import ProfileTabs from "./ProfileTabs";

const meta: Meta<typeof ProfileTabs> = {
  title: "Components/ProfileTabs",
  component: ProfileTabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

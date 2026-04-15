import type { Meta, StoryObj } from "@storybook/react";
import Sidebar from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Common/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActiveFeed: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/feed",
      },
    },
  },
};

export const ActiveSearch: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/search",
      },
    },
  },
};

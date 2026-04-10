import { BoardCardSize } from "./board-card.type";

type BoardCardStyle = {
  container: string;
  collageWrap: string;
  title: string;
  description: string;
  metaRow: string;
  saveText: string;
  showDescription: boolean;
  showBadge: boolean;
  showArrow: boolean;
};

export const boardCardStyles: Record<BoardCardSize, BoardCardStyle> = {
  lg: {
    container:
      "rounded-[28px] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]",
    collageWrap: "mb-5",
    title: "text-[20px] font-semibold leading-7 text-[#111827]",
    description: "mt-2 text-[15px] leading-7 text-[#6B7280]",
    metaRow: "mt-6 flex items-center justify-between gap-3",
    saveText: "text-[15px] text-[#6B7280]",
    showDescription: true,
    showBadge: true,
    showArrow: false,
  },
  md: {
    container:
      "rounded-[24px] bg-white p-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.05)]",
    collageWrap: "mb-4",
    title: "text-[18px] font-semibold leading-6 text-[#111827]",
    description: "",
    metaRow: "mt-2 flex items-center justify-between gap-3",
    saveText: "text-[14px] text-[#6B7280]",
    showDescription: false,
    showBadge: false,
    showArrow: false,
  },
  sm: {
    container:
      "rounded-[22px] bg-white p-3 shadow-[0_4px_12px_rgba(15,23,42,0.05)]",
    collageWrap: "mb-3",
    title: "text-[16px] font-semibold leading-6 text-[#111827]",
    description: "",
    metaRow: "mt-2 flex items-center justify-between gap-3",
    saveText: "text-[13px] text-[#9CA3AF]",
    showDescription: false,
    showBadge: false,
    showArrow: true,
  },
};

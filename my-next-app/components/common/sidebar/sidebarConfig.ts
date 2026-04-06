export type IconKey =
  | "House"
  | "Search"
  | "Bell"
  | "Bookmark"
  | "User"
  | "Settings";

export type SidebarItemType = {
  href: string;
  label: string;
  icon: IconKey;
};

export const sidebarItems: SidebarItemType[] = [
  { href: "/", label: "홈", icon: "House" },
  { href: "/search", label: "탐색", icon: "Search" },
  { href: "/notification", label: "알림", icon: "Bell" },
  { href: "/saved", label: "저장", icon: "Bookmark" },
  { href: "/profile", label: "프로필", icon: "User" },
  { href: "/settings", label: "설정", icon: "Settings" },
];

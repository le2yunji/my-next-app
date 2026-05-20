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
  /** 로그인 유저의 ID로 href를 동적으로 결정해야 하는 항목 */
  authRequired?: boolean;
};

export const sidebarItems: SidebarItemType[] = [
  { href: "/", label: "홈", icon: "House" },
  { href: "/search", label: "탐색", icon: "Search" },
  { href: "/notification", label: "알림", icon: "Bell" },
  { href: "/saved", label: "저장", icon: "Bookmark" },
  { href: "/profile", label: "프로필", icon: "User", authRequired: true },
  { href: "/settings/accounts", label: "설정", icon: "Settings" },
];

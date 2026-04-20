import { sidebarItems } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";
import Logo from "./Logo";
import CreatePostButton from "./CreatePostButton";
import SidebarUserAvatar from "./SidebarUserAvatar";

export default function Sidebar() {
  return (
    <>
      {/* 태블릿+ : 왼쪽 사이드바 (md: 아이콘만 / lg+: 아이콘+텍스트) */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-warm-white py-6 md:flex md:w-20 md:px-2 lg:w-50 lg:px-3">
        <div className="mb-8 flex items-center justify-center px-2 lg:justify-start lg:px-4">
          {/* 태블릿(md): 컴팩트 로고, 데스크탑(lg+): 풀 로고 */}
          <Logo variant="compact-plain" className="lg:hidden" />
          <Logo variant="full" className="hidden lg:block" />
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>

        {/* 하단 영역: 새 게시물 버튼 + 내 프로필 아바타 */}
        <div className="mt-auto flex flex-col gap-1 px-2 lg:px-0">
          <CreatePostButton />
          <SidebarUserAvatar />
        </div>
      </aside>

      {/* 모바일 : 상단 로고 바 */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-gray-200 bg-warm-white px-4 md:hidden">
        <Logo variant="full" />
      </header>

      {/* 모바일 : 하단 고정 바 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-warm-white md:hidden">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            variant="bottom"
          />
        ))}
      </nav>
    </>
  );
}

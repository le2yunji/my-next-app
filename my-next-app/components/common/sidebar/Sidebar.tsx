import { sidebarItems } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-50 flex-col px-3 py-6 bg-warm-white">
      {/* 로고 */}
      <div className="mb-8 px-4">
        <span className="text-xl font-bold tracking-tight">MUTE</span>
      </div>

      {/* 메뉴 */}
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
    </aside>
  );
}

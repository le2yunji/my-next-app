import SettingsSidebar from "@/widgets/settings-sidebar/ui/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-gray">
        <SettingsSidebar />
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}

// features/users/ui/ProfileTabs/ProfileTabs
"use client";

import { Bookmark, FileText, LayoutGrid } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const tabs = [
  { id: "boards", label: "Boards", icon: LayoutGrid },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "saved", label: "Saved", icon: Bookmark },
];

export default function ProfileTabs({ activeId }: { activeId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // 활성 탭 뒤에 깔리는 슬라이더의 크기/위치 정보
  const [sliderStyle, setSliderStyle] = useState({ width: 0, left: 0 });
  // 각 탭 버튼 DOM을 배열로 저장하기 위한 ref
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // 탭 전체를 감싸는 부모 컨테이너 DOM ref
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = () => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
    const button = buttonRefs.current[activeIndex];
    const container = containerRef.current;
    if (button && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setSliderStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      });
    }
  };
  // activeId가 바뀔 때마다 슬라이더 위치 다시 계산
  useEffect(() => {
    updateSlider();
  }, [activeId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => updateSlider());
    observer.observe(container);
    return () => observer.disconnect();
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      className="bg-warm-white rounded-2xl p-2 flex gap-2 relative"
    >
      <div
        className="absolute top-2 bottom-2 rounded-xl bg-white shadow-sm transition-all duration-300 ease-in-out"
        style={{ width: sliderStyle.width, left: sliderStyle.left }}
      />

      {/* tabs 배열을 순회하면서 버튼 렌더링 */}
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onClick={() => {
              // 현재 쿼리스트링 복사
              const params = new URLSearchParams(searchParams.toString());
              // tab 쿼리값을 현재 탭 id로 변경
              params.set("tab", tab.id);
              // 현재 경로에 쿼리만 바꿔서 URL 업데이트
              router.replace(`${pathname}?${params.toString()}`);
            }}
            className={`relative z-10 inline-flex items-center justify-center gap-1 flex-1 rounded-xl px-4.5 py-3.5 h-12 cursor-pointer transition-colors duration-300 ${
              isActive
                ? "text-cool-gray font-bold"
                : "text-cool-gray/50 font-medium"
            }`}
          >
            <span className="inline-flex items-center justify-center w-5 h-5">
              <Icon size={20} />
            </span>
            <span className="text-sm">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

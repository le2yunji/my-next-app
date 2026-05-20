"use client";

import Avatar from "@/shared/ui/Avatar";

export function ProfileImageField() {
  return (
    <section className="flex items-center justify-between rounded-xl bg-linen px-4 py-4">
      <div className="flex items-center gap-3">
        <Avatar alt="프로필 이미지" size="md" />

        <div>
          <p className="text-sm font-semibold text-near-black">프로필 사진</p>
          <p className="text-xs text-cool-gray">
            계정에 표시되는 대표 이미지입니다.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="rounded-lg bg-near-black px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
      >
        사진 변경
      </button>
    </section>
  );
}
